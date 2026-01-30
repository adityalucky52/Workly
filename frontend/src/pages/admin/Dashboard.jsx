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
  Loader2,
  UsersRound,
  Clock,
  AlertCircle,
} from "lucide-react";
import { adminAPI, groupAPI } from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    managers: 0,
    employees: 0,
    groups: 0,
    pendingManagers: 0,
    activeEmployees: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentManagers, setRecentManagers] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [managersRes, employeesRes, groupsRes] = await Promise.all([
          adminAPI.getAllManagers({ limit: 100 }),
          adminAPI.getAllEmployees({ limit: 100 }),
          groupAPI.getAllGroups({ limit: 100 }),
        ]);

        const managers = managersRes.data.data || [];
        const employees = employeesRes.data.data || [];
        const groups = groupsRes.data.data || [];

        // Calculate stats
        setStats({
          totalUsers: managers.length + employees.length,
          managers: managers.length,
          employees: employees.length,
          groups: groups.length,
          pendingManagers: managers.filter((m) => m.status === "Pending")
            .length,
          activeEmployees: employees.filter((e) => e.status === "Active")
            .length,
        });

        // Get recent users (combine managers + employees, sort by date, take 5)
        const allUsers = [
          ...managers.map((m) => ({ ...m, role: "manager" })),
          ...employees.map((e) => ({ ...e, role: "employee" })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setRecentUsers(allUsers.slice(0, 5));

        // Get recent pending managers
        const pendingManagersList = managers
          .filter((m) => m.status === "Pending")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentManagers(pendingManagersList);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      link: "/admin/users",
    },
    {
      title: "Managers",
      value: stats.managers,
      icon: UserCog,
      color: "text-purple-500",
      link: "/admin/managers",
    },
    {
      title: "Employees",
      value: stats.employees,
      icon: UserCheck,
      color: "text-green-500",
      link: "/admin/employees",
    },
    {
      title: "Groups",
      value: stats.groups,
      icon: UsersRound,
      color: "text-orange-500",
      link: "/admin/groups",
    },
  ];

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
          <Link to="/admin/groups">
            <UsersRound className="mr-2 h-4 w-4" />
            Manage Groups
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span>Click to view details</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingManagers}
            </div>
            <p className="text-xs text-muted-foreground">
              Managers awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Employees
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeEmployees}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.employees > 0
                ? Math.round((stats.activeEmployees / stats.employees) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Employee activity rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Group Size
            </CardTitle>
            <UsersRound className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.groups > 0
                ? Math.round(stats.employees / stats.groups)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Employees per group</p>
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
            {recentUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No users found</p>
              </div>
            ) : (
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
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "manager" ? "default" : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "Active"
                              ? "default"
                              : user.status === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pending Manager Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Managers awaiting approval</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/managers" className="flex items-center gap-1">
                  View all
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentManagers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending approvals</p>
                <p className="text-sm">All managers are approved</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manager</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentManagers.map((manager) => (
                    <TableRow key={manager._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={manager.avatar} />
                            <AvatarFallback>
                              {manager.firstName?.[0]}
                              {manager.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {manager.firstName} {manager.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {manager.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(manager.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/managers">Review</Link>
                        </Button>
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
  );
};

export default Dashboard;
