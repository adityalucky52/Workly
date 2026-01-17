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
} from "lucide-react";

const stats = [
  { title: "Active Tasks", value: "5", icon: ListTodo, color: "text-blue-600" },
  {
    title: "Completed",
    value: "28",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  { title: "In Progress", value: "3", icon: Clock, color: "text-yellow-600" },
  { title: "Overdue", value: "1", icon: AlertCircle, color: "text-red-600" },
];

const tasks = [
  {
    id: 1,
    title: "Complete API documentation",
    priority: "High",
    dueDate: "2024-01-30",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Write unit tests",
    priority: "Medium",
    dueDate: "2024-01-28",
    status: "Pending",
  },
  {
    id: 3,
    title: "Fix login bug",
    priority: "High",
    dueDate: "2024-01-25",
    status: "In Progress",
  },
  {
    id: 4,
    title: "Update user profile page",
    priority: "Low",
    dueDate: "2024-02-01",
    status: "Pending",
  },
];

const Dashboard = () => {
  const completionRate = 85;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, John! Here's your task overview.
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
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{completionRate}%</span>
                <Badge variant="secondary">This week</Badge>
              </div>
              <Progress value={completionRate} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You've completed 17 out of 20 tasks this week. Great job!
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
                <CardDescription>Your current assignments</CardDescription>
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
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
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
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status === "In Progress"
                            ? "default"
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
            <Button variant="outline" asChild>
              <Link to="/employee/tasks/update">Update Task Status</Link>
            </Button>
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
