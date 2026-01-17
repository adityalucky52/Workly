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
  Building2,
  UserCog,
  Calendar,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";

const employeeData = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 555-0123",
  department: "Engineering",
  manager: "Jane Smith",
  status: "Active",
  joinedAt: "2024-01-15",
  completedTasks: 25,
  totalTasks: 30,
};

const tasks = [
  {
    id: 1,
    title: "Complete documentation",
    status: "Completed",
    priority: "High",
    dueDate: "2024-01-20",
  },
  {
    id: 2,
    title: "Code review",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2024-01-25",
  },
  {
    id: 3,
    title: "Unit testing",
    status: "Pending",
    priority: "Low",
    dueDate: "2024-01-28",
  },
];

const EmployeeDetails = () => {
  const { id } = useParams();
  const completionRate = Math.round(
    (employeeData.completedTasks / employeeData.totalTasks) * 100,
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Employee Details
            </h1>
            <p className="text-muted-foreground">View employee information</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/admin/employees/${id}/transfer`}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transfer Employee
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`/avatars/${id}.jpg`} />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">
                {employeeData.name}
              </h2>
              <p className="text-muted-foreground">{employeeData.department}</p>
              <Badge className="mt-2">{employeeData.status}</Badge>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employeeData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employeeData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employeeData.department}</span>
              </div>
              <div className="flex items-center gap-3">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Manager: {employeeData.manager}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined: {employeeData.joinedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {employeeData.completedTasks}
                </div>
                <p className="text-xs text-muted-foreground">
                  out of {employeeData.totalTasks} total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <Progress value={completionRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
              <CardDescription>Current and recent tasks</CardDescription>
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
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.status === "Completed"
                              ? "secondary"
                              : task.status === "In Progress"
                                ? "default"
                                : "outline"
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
    </div>
  );
};

export default EmployeeDetails;
