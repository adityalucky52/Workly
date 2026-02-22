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
  ListTodo,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  PlusCircle,
  Loader2,
  ListChecks,
} from "lucide-react";
import { managerAPI, adminAPI } from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teamSize: 0,
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get current user first to personalize welcome message
        const userRes = await adminAPI.getCurrentUser();
        if (userRes.data.success) {
          setCurrentUser(userRes.data.data);
        }

        const statsRes = await managerAPI.getDashboardStats();
        if (statsRes.data.success) {
          const data = statsRes.data.data;

          setStats({
            teamSize: data.team.size,
            activeTasks: data.tasks.total - data.tasks.completed, // Or use specific status
            completedTasks: data.tasks.completed,
            overdueTasks: data.tasks.overdue,
          });

          setTeamMembers(data.team.members || []);
          setRecentTasks(data.recentTasks || []);
        }
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
      title: "Team Members",
      value: stats.teamSize,
      icon: Users,
      description: "employees reporting to you",
      color: "text-blue-600",
    },
    {
      title: "Active Tasks",
      value: stats.activeTasks,
      icon: ListTodo,
      description: "tasks in progress or pending",
      color: "text-orange-600",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: CheckCircle2,
      description: "total completed tasks",
      color: "text-green-600",
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
      icon: AlertCircle,
      description: "tasks past due date",
      color: "text-red-600",
    },
  ];

  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase() || "";
    const variants = {
      active: "default",
      pending: "secondary",
      inactive: "destructive",
    };
    const displayStatus =
      status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
    return (
      <Badge variant={variants[normalized] || "default"}>{displayStatus}</Badge>
    );
  };

  const getTaskStatusBadge = (status) => {
    const normalized = status?.toLowerCase() || "";

    let variant = "secondary";
    if (normalized === "completed") variant = "default";
    if (normalized === "in-progress") variant = "default";
    if (normalized === "overdue") variant = "destructive";
    if (normalized === "cancelled") variant = "outline";

    let icon = null;
    if (normalized === "completed")
      icon = <CheckCircle2 className="mr-1 h-3 w-3" />;
    if (normalized === "in-progress") icon = <Clock className="mr-1 h-3 w-3" />;

    const displayStatus =
      normalized === "in-progress"
        ? "In Progress"
        : status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : "";

    return (
      <Badge variant={variant} className="flex w-fit items-center">
        {icon}
        {displayStatus}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.firstName || "Manager"}! Here's your
            team overview.
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
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span>{stat.description}</span>
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
                <CardDescription>Your team's overview</CardDescription>
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
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No team members assigned</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.firstName?.[0]}
                              {member.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.role || "Employee"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.email}
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Latest created tasks</CardDescription>
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
            {recentTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ListChecks className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No tasks created yet</p>
              </div>
            ) : (
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
                    <TableRow key={task._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            For:{" "}
                            {task.assignee
                              ? `${task.assignee.firstName} ${task.assignee.lastName}`
                              : "Unassigned"}
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
                      <TableCell>{getTaskStatusBadge(task.status)}</TableCell>
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
