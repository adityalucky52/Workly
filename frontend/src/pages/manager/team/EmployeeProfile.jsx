import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import { Progress } from "../../../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  ListTodo,
  Loader2,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { managerAPI, adminAPI } from "../../../services/api"; // Using adminAPI to get employee details as fallback or primary

const EmployeeProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    active: 0,
    efficiency: 0,
    workload: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // We can reuse adminAPI.getEmployeeById if managerAPI doesn't have a specific endpoint wrapper
        // But lets stick to manager logic. Retrieve employee details and tasks.

        // Fetch User Details
        // Ideally we should use managerAPI.getTeamMemberById(id) but looking at previous file scans
        // I noticed adminAPI.getEmployeeById exists, let's try to find if managerAPI has it or create it.
        // It was listed in the API file view earlier: getTeamMemberById: (id) => api.get(`/manager/team/${id}`),

        let employeeData = null;
        try {
          const empRes = await managerAPI.getTeamMemberById(id);
          if (empRes.data.success) employeeData = empRes.data.data;
        } catch (e) {
          // Fallback if specific route fails or not implemented on backend
          // In real app, might fail due to permissions. Let's assume the manager route works as it was in the API list.
          throw e;
        }

        // Fetch Tasks
        const tasksRes = await managerAPI.getAssignedTasks({ limit: 1000 }); // Get all tasks to filter
        const allTasks = tasksRes.data.success ? tasksRes.data.data : [];
        const empTasks = allTasks.filter((t) => t.assignee?._id === id);

        // Calculate Stats
        const completed = empTasks.filter(
          (t) => t.status === "Completed",
        ).length;
        const active = empTasks.filter(
          (t) => t.status !== "Completed" && t.status !== "Cancelled",
        ).length;
        const total = empTasks.length;

        // Efficiency: (Completed On Time / Total Completed) * 100
        const completedTasks = empTasks.filter((t) => t.status === "Completed");
        const onTimeTasks = completedTasks.filter((t) => {
          if (!t.dueDate) return true;
          return new Date(t.updatedAt) <= new Date(t.dueDate);
        });
        const efficiency =
          completedTasks.length > 0
            ? Math.round((onTimeTasks.length / completedTasks.length) * 100)
            : 100; // Default to 100 if no completed tasks yet

        // Simple workload calculation
        let workload = Math.round((active / 5) * 100);
        if (workload > 100) workload = 100;

        setEmployee(employeeData);
        setTasks(empTasks);
        setStats({
          completed,
          active,
          efficiency,
          workload,
        });
      } catch (err) {
        console.error("Error fetching employee profile:", err);
        setError("Failed to load employee profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive opacity-50" />
        <p className="text-muted-foreground">{error || "Employee not found"}</p>
        <Button variant="outline" asChild>
          <Link to="/manager/team">Back to Team</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/manager/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Profile
          </h1>
          <p className="text-muted-foreground">View team member details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-2xl">
                  {employee.firstName?.[0]}
                  {employee.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-muted-foreground">
                {employee.role || "Employee"}
              </p>
              <Badge
                className="mt-2"
                variant={employee.status === "Active" ? "default" : "secondary"}
              >
                {employee.status}
              </Badge>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.phone || "No phone"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined {new Date(employee.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Workload</span>
                  <span className={stats.workload >= 80 ? "text-red-600" : ""}>
                    {stats.workload}%
                  </span>
                </div>
                <Progress value={stats.workload} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Total tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Active tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Efficiency
                </CardTitle>
                <ListTodo className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.efficiency}%</div>
                <p className="text-xs text-muted-foreground">
                  Task completion rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Current Tasks</CardTitle>
              <CardDescription>Tasks assigned to this employee</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No tasks assigned yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task._id}>
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.priority === "High"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.status === "In Progress"
                                ? "default"
                                : task.status === "Completed"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
