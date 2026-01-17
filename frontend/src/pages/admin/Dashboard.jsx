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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Users,
  UserCog,
  UserCheck,
  ListTodo,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "2,350",
    change: "+180",
    icon: Users,
    description: "from last month",
  },
  {
    title: "Managers",
    value: "45",
    change: "+3",
    icon: UserCog,
    description: "from last month",
  },
  {
    title: "Employees",
    value: "2,305",
    change: "+177",
    icon: UserCheck,
    description: "from last month",
  },
  {
    title: "Active Tasks",
    value: "1,234",
    change: "+89",
    icon: ListTodo,
    description: "from last week",
  },
];

const recentUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Employee",
    status: "Active",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    status: "Active",
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "Employee",
    status: "Inactive",
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Employee",
    status: "Active",
    date: "2024-01-12",
  },
];

const recentTasks = [
  {
    id: 1,
    title: "Complete project documentation",
    assignee: "John Doe",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 2,
    title: "Review code changes",
    assignee: "Jane Smith",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Update user permissions",
    assignee: "Bob Wilson",
    status: "Completed",
    priority: "Low",
  },
  {
    id: 4,
    title: "Design new dashboard",
    assignee: "Alice Brown",
    status: "In Progress",
    priority: "High",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your system.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/users/create">Add New User</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              User registration and task completion trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Chart placeholder - integrate with chart library
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Task Completion Rate</span>
              <span className="font-bold text-green-500">87%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Users Today</span>
              <span className="font-bold">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Approvals</span>
              <span className="font-bold text-yellow-500">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Overdue Tasks</span>
              <span className="font-bold text-red-500">7</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Newly registered users</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/users" className="flex items-center gap-1">
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
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Latest task updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/tasks" className="flex items-center gap-1">
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.assignee}
                        </p>
                      </div>
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
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status === "Completed"
                            ? "outline"
                            : task.status === "In Progress"
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
    </div>
  );
};

export default Dashboard;
