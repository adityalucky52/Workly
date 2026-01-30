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
  UserCog,
  Calendar,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Loader2,
  User,
  Briefcase,
  UsersRound,
  AlertCircle,
} from "lucide-react";
import { adminAPI, groupAPI } from "../../../services/api";

const getStatusBadge = (status) => {
  const variants = {
    Active: "default",
    Pending: "secondary",
    Inactive: "destructive",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
};

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [employeeGroup, setEmployeeGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch employee and groups in parallel
        const [employeeRes, groupsRes] = await Promise.all([
          adminAPI.getEmployeeById(id),
          groupAPI.getAllGroups({ limit: 100 }),
        ]);

        if (employeeRes.data.success) {
          setEmployee(employeeRes.data.data);
        }

        // Find the group this employee belongs to
        if (groupsRes.data.success) {
          const groups = groupsRes.data.data;
          const foundGroup = groups.find((group) =>
            group.employees?.some((emp) => emp._id === id),
          );
          setEmployeeGroup(foundGroup || null);
        }
      } catch (err) {
        console.error("Failed to fetch employee:", err);
        setError(err.response?.data?.message || "Failed to fetch employee");
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
        <span className="ml-2 text-muted-foreground">
          Loading employee details...
        </span>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-destructive mb-4">{error || "Employee not found"}</p>
        <Button asChild>
          <Link to="/admin/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
      </div>
    );
  }

  const completionRate =
    employee.totalTasks > 0
      ? Math.round((employee.completedTasks / employee.totalTasks) * 100)
      : 0;

  // Get manager from group (if assigned to a group)
  const groupManager = employeeGroup?.managers?.[0] || null;

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
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-2xl">
                  {employee.firstName?.[0]}
                  {employee.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-muted-foreground">Employee</p>
              {getStatusBadge(employee.status)}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {employee.phone || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined: {new Date(employee.createdAt).toLocaleDateString()}
                </span>
              </div>
              {employee.lastLogin && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Last Login: {new Date(employee.lastLogin).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Group & Manager Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersRound className="h-5 w-5" />
                Group Assignment
              </CardTitle>
              <CardDescription>
                Group and manager details for this employee
              </CardDescription>
            </CardHeader>
            <CardContent>
              {employeeGroup ? (
                <div className="space-y-4">
                  {/* Group Info */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <UsersRound className="h-4 w-4" />
                        {employeeGroup.name}
                      </h3>
                      <Badge variant="outline">
                        {employeeGroup.employees?.length || 0} members
                      </Badge>
                    </div>
                    {employeeGroup.description && (
                      <p className="text-sm text-muted-foreground">
                        {employeeGroup.description}
                      </p>
                    )}
                  </div>

                  {/* Manager from Group */}
                  {groupManager ? (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">
                        Reporting Manager (from group)
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={groupManager.avatar} />
                          <AvatarFallback>
                            {groupManager.firstName?.[0]}
                            {groupManager.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {groupManager.firstName} {groupManager.lastName}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {groupManager.email}
                          </div>
                        </div>
                        <Badge variant="default">Manager</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border rounded-lg border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">
                          No manager assigned to this group
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mb-2 opacity-50" />
                  <p className="font-medium">Not assigned to any group</p>
                  <p className="text-sm text-center mt-1">
                    This employee is not part of any group yet.
                    <br />
                    Add them to a group to assign a manager.
                  </p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/admin/groups">
                      <UsersRound className="mr-2 h-4 w-4" />
                      Manage Groups
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

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
                  {employee.completedTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  out of {employee.totalTasks || 0} total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <Briefcase className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <Progress value={completionRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {employee.recentTasks && employee.recentTasks.length > 0 ? (
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
                    {employee.recentTasks.map((task) => (
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
