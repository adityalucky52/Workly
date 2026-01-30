import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Target,
  Loader2,
} from "lucide-react";
import { employeeAPI, adminAPI } from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    tasks: {
      total: 0,
      pending: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
    },
    completionRate: 0,
    recentTasks: [],
    upcomingDeadlines: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // Fetch current user and dashboard stats in parallel
        const [userRes, statsRes] = await Promise.all([
          adminAPI.getCurrentUser(),
          employeeAPI.getDashboardStats(),
        ]);

        if (userRes.data.success) {
          setCurrentUser(userRes.data.data);
        }

        if (statsRes.data.success) {
          setDashboardData(statsRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  const { tasks, completionRate, recentTasks } = dashboardData;

  const stats = [
    {
      title: "Active Tasks",
      value: tasks.total - tasks.completed,
      icon: ListTodo,
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: tasks.completed,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: tasks.inProgress,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Overdue",
      value: tasks.overdue,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  const getStatusBadge = (status) => {
    let variant = "secondary";
    if (status === "Completed") variant = "default"; // or green custom
    if (status === "In Progress") variant = "default";
    if (status === "Overdue") variant = "destructive";

    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.firstName || "Employee"}! Here's your task
          overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress & Tasks */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{completionRate}%</span>
                <Badge variant="secondary">All Time</Badge>
              </div>
              <Progress value={completionRate} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You've completed {tasks.completed} out of {tasks.total} tasks
                assigned to you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Recently assigned tasks</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/employee/tasks" className="flex items-center gap-1">
                  View all
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No recent tasks found.</p>
              </div>
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
                  {recentTasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.priority === "High"
                              ? "destructive"
                              : task.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {task.priority || "Medium"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/employee/tasks">View All Tasks</Link>
            </Button>
            {/* 
            <Button variant="outline" asChild>
              <Link to="/employee/tasks/update">Update Task Status</Link>
            </Button>
             */}
            <Button variant="outline" asChild>
              <Link to="/employee/activity/history">View History</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
