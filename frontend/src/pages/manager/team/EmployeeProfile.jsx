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
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
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
} from "lucide-react";

const employeeData = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 555-0123",
  role: "Senior Developer",
  status: "Active",
  joinedAt: "2023-06-15",
  completedTasks: 28,
  activeTasks: 5,
  workload: 75,
};

const tasks = [
  {
    id: 1,
    title: "Complete API documentation",
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
    title: "Fix authentication bug",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-01-25",
  },
];

const EmployeeProfile = () => {
  const { id } = useParams();

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
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">
                {employeeData.name}
              </h2>
              <p className="text-muted-foreground">{employeeData.role}</p>
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
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Workload</span>
                  <span
                    className={
                      employeeData.workload >= 80 ? "text-red-600" : ""
                    }
                  >
                    {employeeData.workload}%
                  </span>
                </div>
                <Progress value={employeeData.workload} />
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
                <div className="text-2xl font-bold">
                  {employeeData.completedTasks}
                </div>
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
                <div className="text-2xl font-bold">
                  {employeeData.activeTasks}
                </div>
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
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  On-time completion
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
                            task.priority === "High" ? "destructive" : "default"
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
      </div>
    </div>
  );
};

export default EmployeeProfile;
