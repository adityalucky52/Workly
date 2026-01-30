import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Progress } from "../../../components/ui/progress";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Loader2,
  Users,
} from "lucide-react";
import { adminAPI, groupAPI } from "../../../services/api";

const getWorkloadColor = (workload) => {
  if (workload >= 90) return "text-red-600";
  if (workload >= 70) return "text-yellow-600";
  return "text-green-600";
};

const getWorkloadBadge = (workload) => {
  if (workload >= 90) return <Badge variant="destructive">Overloaded</Badge>;
  if (workload >= 70) return <Badge variant="default">High</Badge>;
  if (workload >= 40) return <Badge variant="secondary">Normal</Badge>;
  return <Badge variant="outline">Light</Badge>;
};

const WorkloadReport = () => {
  const [loading, setLoading] = useState(true);
  const [workloadData, setWorkloadData] = useState([]);
  const [managerWorkload, setManagerWorkload] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    avgWorkload: 0,
    overloadedCount: 0,
    totalOverdue: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesRes, tasksRes, groupsRes] = await Promise.all([
          adminAPI.getAllEmployees({ limit: 1000 }),
          adminAPI.getAllTasks({ limit: 1000 }),
          groupAPI.getAllGroups({ limit: 100 }),
        ]);

        const employees = employeesRes.data.data || [];
        const tasks = tasksRes.data.data || [];
        const groups = groupsRes.data.data || [];

        // === Employee Workload Calculation ===
        const employeeStats = employees.map((emp) => {
          const empTasks = tasks.filter((t) => t.assignee?._id === emp._id);

          const assigned = empTasks.length;
          const completed = empTasks.filter(
            (t) => t.status === "Completed",
          ).length;
          const inProgress = empTasks.filter(
            (t) => t.status === "In Progress",
          ).length;

          const overdue = empTasks.filter(
            (t) =>
              t.status !== "Completed" &&
              t.dueDate &&
              new Date(t.dueDate) < new Date(),
          ).length;

          // Simple workload logic: (Active Tasks / 5) * 100. Capped at 100.
          // Assuming 5 tasks is "Full Capacity" for demo purposes.
          const activeTasks = inProgress + (assigned - completed - inProgress); // Pending included
          let workload = Math.round((activeTasks / 5) * 100);
          if (workload > 100) workload = 100;

          // Find manager
          const group = groups.find((g) =>
            g.employees?.some((e) => e._id === emp._id),
          );
          const managerName = group?.managers?.[0]
            ? `${group.managers[0].firstName} ${group.managers[0].lastName}`
            : "Unassigned";

          return {
            id: emp._id,
            name: `${emp.firstName} ${emp.lastName}`,
            avatar: emp.avatar,
            manager: managerName,
            assigned,
            completed,
            inProgress,
            overdue,
            workload,
          };
        });

        // Filter out employees with 0 tasks if you want to declutter,
        // OR keep them to show availability. Let's keep them but sort by workload.
        const sortedEmployeeStats = employeeStats.sort(
          (a, b) => b.workload - a.workload,
        );
        setWorkloadData(sortedEmployeeStats);

        // === Manager Workload Calculation ===
        const managerStats = groups
          .map((group) => {
            if (!group.managers || group.managers.length === 0) return null;

            const manager = group.managers[0];
            const teamMemberIds = group.employees?.map((e) => e._id) || [];

            const teamTasks = tasks.filter((t) =>
              teamMemberIds.includes(t.assignee?._id),
            );

            // Calc average workload of team members
            const teamWorkloads = employeeStats
              .filter((e) => teamMemberIds.includes(e.id))
              .map((e) => e.workload);

            const avgWorkload = teamWorkloads.length
              ? Math.round(
                  teamWorkloads.reduce((a, b) => a + b, 0) /
                    teamWorkloads.length,
                )
              : 0;

            return {
              id: manager._id,
              name: `${manager.firstName} ${manager.lastName}`,
              avatar: manager.avatar,
              team: teamMemberIds.length,
              totalTasks: teamTasks.length,
              avgWorkload,
              trend: Math.random() > 0.5 ? "up" : "down", // Mock trend for now as we don't have historical data
            };
          })
          .filter(Boolean);

        setManagerWorkload(managerStats);

        // === Overall Summary ===
        const totalWorkload = sortedEmployeeStats.reduce(
          (sum, w) => sum + w.workload,
          0,
        );
        const globalAvgWorkload = sortedEmployeeStats.length
          ? Math.round(totalWorkload / sortedEmployeeStats.length)
          : 0;

        const totalAssigned = sortedEmployeeStats.reduce(
          (sum, w) => sum + w.assigned,
          0,
        );
        const totalCompleted = sortedEmployeeStats.reduce(
          (sum, w) => sum + w.completed,
          0,
        );

        setSummaryStats({
          avgWorkload: globalAvgWorkload,
          overloadedCount: sortedEmployeeStats.filter((w) => w.workload >= 90)
            .length,
          totalOverdue: sortedEmployeeStats.reduce(
            (sum, w) => sum + w.overdue,
            0,
          ),
          completionRate: totalAssigned
            ? Math.round((totalCompleted / totalAssigned) * 100)
            : 0,
        });
      } catch (error) {
        console.error("Failed to fetch workload report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workload Report</h1>
        <p className="text-muted-foreground">
          Employee workload distribution and analysis
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Workload</CardDescription>
            <CardTitle
              className={`text-2xl ${getWorkloadColor(summaryStats.avgWorkload)}`}
            >
              {summaryStats.avgWorkload}%
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overloaded Employees</CardDescription>
            <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
              {summaryStats.overloadedCount}
              {summaryStats.overloadedCount > 0 && (
                <AlertTriangle className="h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Overdue Tasks</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">
              {summaryStats.totalOverdue}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {summaryStats.completionRate}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Manager Workload Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Team Workload by Manager</CardTitle>
          <CardDescription>Average workload per team</CardDescription>
        </CardHeader>
        <CardContent>
          {managerWorkload.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No teams found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {managerWorkload.map((manager) => (
                <Card key={manager.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={manager.avatar} />
                        <AvatarFallback>
                          {manager.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p
                          className="font-medium truncate max-w-[120px]"
                          title={manager.name}
                        >
                          {manager.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {manager.team} team members
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Avg Workload</span>
                        <span
                          className={`font-bold ${getWorkloadColor(manager.avgWorkload)}`}
                        >
                          {manager.avgWorkload}%
                        </span>
                      </div>
                      <Progress value={manager.avgWorkload} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {manager.totalTasks} tasks
                        </span>
                        {manager.trend === "up" && (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        )}
                        {manager.trend === "down" && (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Workload Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Workload Details</CardTitle>
          <CardDescription>
            Individual employee task distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workloadData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No employee data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>In Progress</TableHead>
                  <TableHead>Overdue</TableHead>
                  <TableHead>Workload</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workloadData.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback>
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{employee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.manager}</TableCell>
                    <TableCell>{employee.assigned}</TableCell>
                    <TableCell className="text-green-600">
                      {employee.completed}
                    </TableCell>
                    <TableCell className="text-blue-600">
                      {employee.inProgress}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {employee.overdue}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={employee.workload}
                          className="w-16 h-2"
                        />
                        <span
                          className={`font-medium ${getWorkloadColor(employee.workload)}`}
                        >
                          {employee.workload}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getWorkloadBadge(employee.workload)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkloadReport;
