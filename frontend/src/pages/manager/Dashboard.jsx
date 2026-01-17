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
  ListTodo,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  PlusCircle,
} from "lucide-react";

const stats = [
  {
    title: "Team Members",
    value: "12",
    change: "+2",
    icon: Users,
    description: "this month",
  },
  {
    title: "Active Tasks",
    value: "34",
    change: "+8",
    icon: ListTodo,
    description: "assigned",
  },
  {
    title: "Completed",
    value: "89",
    change: "+15",
    icon: CheckCircle2,
    description: "this week",
  },
  {
    title: "Overdue",
    value: "3",
    change: "-2",
    icon: AlertCircle,
    description: "pending",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    activeTasks: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Designer",
    activeTasks: 3,
    status: "Active",
  },
  {
    id: 3,
    name: "Alex Wilson",
    email: "alex@example.com",
    role: "Developer",
    activeTasks: 7,
    status: "Busy",
  },
  {
    id: 4,
    name: "Sam Taylor",
    email: "sam@example.com",
    role: "QA Engineer",
    activeTasks: 2,
    status: "Active",
  },
];

const recentTasks = [
  {
    id: 1,
    title: "Complete API documentation",
    assignee: "John Doe",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 2,
    title: "Design landing page",
    assignee: "Emily Davis",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Fix login bug",
    assignee: "Alex Wilson",
    status: "Completed",
    priority: "High",
  },
  {
    id: 4,
    title: "Write unit tests",
    assignee: "Sam Taylor",
    status: "In Progress",
    priority: "Low",
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
            Welcome back, Jane! Here's your team overview.
          </p>
        </div>
        <Button asChild>
          <Link to="/manager/tasks/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Task
          </Link>
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

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Your team's current status</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/manager/team" className="flex items-center gap-1">
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
                  <TableHead>Member</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.activeTasks}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {member.status}
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
                <Link
                  to="/manager/tasks/assigned"
                  className="flex items-center gap-1"
                >
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
