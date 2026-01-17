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
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Progress } from "../../../components/ui/progress";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

const workloadData = [
  {
    id: 1,
    name: "John Doe",
    manager: "Jane Smith",
    assigned: 8,
    completed: 5,
    inProgress: 2,
    overdue: 1,
    workload: 85,
  },
  {
    id: 2,
    name: "Emily Davis",
    manager: "Jane Smith",
    assigned: 5,
    completed: 4,
    inProgress: 1,
    overdue: 0,
    workload: 60,
  },
  {
    id: 3,
    name: "Alex Wilson",
    manager: "Tom Brown",
    assigned: 10,
    completed: 6,
    inProgress: 3,
    overdue: 1,
    workload: 95,
  },
  {
    id: 4,
    name: "Sam Taylor",
    manager: "Mike Johnson",
    assigned: 3,
    completed: 2,
    inProgress: 1,
    overdue: 0,
    workload: 35,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    manager: "Sarah Williams",
    assigned: 6,
    completed: 5,
    inProgress: 1,
    overdue: 0,
    workload: 70,
  },
  {
    id: 6,
    name: "Ryan Moore",
    manager: "Chris Davis",
    assigned: 7,
    completed: 3,
    inProgress: 2,
    overdue: 2,
    workload: 80,
  },
];

const managerWorkload = [
  {
    name: "Jane Smith",
    team: 12,
    totalTasks: 45,
    avgWorkload: 72,
    trend: "up",
  },
  { name: "Tom Brown", team: 8, totalTasks: 32, avgWorkload: 85, trend: "up" },
  {
    name: "Mike Johnson",
    team: 15,
    totalTasks: 58,
    avgWorkload: 65,
    trend: "down",
  },
  {
    name: "Sarah Williams",
    team: 6,
    totalTasks: 24,
    avgWorkload: 70,
    trend: "stable",
  },
];

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
  const overloadedCount = workloadData.filter((w) => w.workload >= 90).length;
  const avgWorkload = Math.round(
    workloadData.reduce((sum, w) => sum + w.workload, 0) / workloadData.length,
  );

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
            <CardTitle className={`text-2xl ${getWorkloadColor(avgWorkload)}`}>
              {avgWorkload}%
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overloaded Employees</CardDescription>
            <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
              {overloadedCount}
              {overloadedCount > 0 && <AlertTriangle className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Overdue Tasks</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">
              {workloadData.reduce((sum, w) => sum + w.overdue, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {Math.round(
                (workloadData.reduce((sum, w) => sum + w.completed, 0) /
                  workloadData.reduce((sum, w) => sum + w.assigned, 0)) *
                  100,
              )}
              %
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {managerWorkload.map((manager) => (
              <Card key={manager.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {manager.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{manager.name}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkloadReport;
