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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
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
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  Calendar,
  UserCog,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

// Mock user data
const userData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  role: "Employee",
  department: "Engineering",
  manager: "Jane Smith",
  status: "Active",
  createdAt: "2024-01-15",
  lastLogin: "2024-01-25 10:30 AM",
  avatar: "JD",
};

const userTasks = [
  {
    id: 1,
    title: "Complete project documentation",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-01-30",
  },
  {
    id: 2,
    title: "Code review for feature X",
    status: "Pending",
    priority: "Medium",
    dueDate: "2024-01-28",
  },
  {
    id: 3,
    title: "Update API endpoints",
    status: "Completed",
    priority: "High",
    dueDate: "2024-01-20",
  },
  {
    id: 4,
    title: "Write unit tests",
    status: "In Progress",
    priority: "Low",
    dueDate: "2024-02-01",
  },
];

const userActivity = [
  {
    id: 1,
    action: "Completed task",
    description: "Update API endpoints",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Started task",
    description: "Complete project documentation",
    time: "5 hours ago",
  },
  {
    id: 3,
    action: "Logged in",
    description: "From Chrome on Windows",
    time: "1 day ago",
  },
  {
    id: 4,
    action: "Updated profile",
    description: "Changed phone number",
    time: "3 days ago",
  },
];

const getStatusBadge = (status) => {
  const variants = {
    Active: "default",
    Pending: "secondary",
    Inactive: "outline",
    "In Progress": "default",
    Completed: "secondary",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
};

const getPriorityBadge = (priority) => {
  const variants = {
    High: "destructive",
    Medium: "default",
    Low: "secondary",
  };
  return <Badge variant={variants[priority] || "default"}>{priority}</Badge>;
};

const UserDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">
              View and manage user information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`/avatars/${id}.jpg`} />
                <AvatarFallback className="text-2xl">
                  {userData.avatar}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{userData.name}</h2>
              <p className="text-muted-foreground">{userData.email}</p>
              <div className="mt-2 flex gap-2">
                <Badge>{userData.role}</Badge>
                {getStatusBadge(userData.status)}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.department}</span>
              </div>
              <div className="flex items-center gap-3">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Reports to: {userData.manager}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined: {userData.createdAt}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <Button className="w-full" asChild>
              <Link to={`/admin/users/${id}/assign-manager`}>
                <UserCog className="mr-2 h-4 w-4" />
                Assign Manager
              </Link>
            </Button>
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
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Tasks this month
                </p>
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
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Active tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="tasks">
                <TabsList>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="mt-4">
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
                      {userTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(task.priority)}
                          </TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <div className="space-y-4">
                    {userActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 pb-4 border-b last:border-0"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
