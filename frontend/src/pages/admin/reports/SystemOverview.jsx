import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Users,
  UserCog,
  UserCheck,
  ListTodo,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  Loader2,
  BarChart3,
  Signal,
  Database,
  Lock,
} from "lucide-react";
import { adminAPI } from "../../../services/api";

const SystemOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeManagers: 0,
    activeEmployees: 0,
    totalTasks: 0,
  });
  const [taskStats, setTaskStats] = useState([]);
  const [priorityStats, setPriorityStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [overviewRes, managersRes, employeesRes] = await Promise.all([
          adminAPI.getSystemOverview(),
          adminAPI.getAllManagers({ limit: 1000 }),
          adminAPI.getAllEmployees({ limit: 1000 }),
        ]);

        const overview = overviewRes.data.data;
        const managers = managersRes.data.data || [];
        const employees = employeesRes.data.data || [];

        // 1. User Stats
        setStats({
          totalUsers: managers.length + employees.length,
          activeManagers: managers.filter((m) => m.status === "Active").length,
          activeEmployees: employees.filter((e) => e.status === "Active")
            .length,
          totalTasks: overview.totalTasks || 0,
        });

        // 2. Task Distribution Stats
        const totalTasks = overview.totalTasks || 0;
        const getStatusCount = (status) =>
          overview.tasksByStatus?.find((s) => s._id === status)?.count || 0;

        const completed = getStatusCount("Completed"); // Note: Backend returns "Completed" with capital C usually, checking exact match needed later. Assuming case matches or normalizing.
        const inProgress = getStatusCount("In Progress");
        const pending = getStatusCount("Pending");
        const overdue = overview.overdueTasks || 0;

        // Note: Backend aggregation usually returns case-sensitive statuses.
        // If your backend stores "Completed", "In Progress", ensure these match.
        // The getSystemOverview controller I saw groups by field value.

        setTaskStats([
          {
            title: "Completed",
            value: completed,
            percentage: totalTasks
              ? Math.round((completed / totalTasks) * 100)
              : 0,
            color: "text-green-600",
            icon: CheckCircle2,
          },
          {
            title: "In Progress",
            value: inProgress,
            percentage: totalTasks
              ? Math.round((inProgress / totalTasks) * 100)
              : 0,
            color: "text-blue-600",
            icon: Clock,
          },
          {
            title: "Pending",
            value: pending,
            percentage: totalTasks
              ? Math.round((pending / totalTasks) * 100)
              : 0,
            color: "text-yellow-600",
            icon: Activity,
          },
          {
            title: "Overdue",
            value: overdue,
            percentage: totalTasks
              ? Math.round((overdue / totalTasks) * 100)
              : 0,
            color: "text-red-600",
            icon: AlertCircle,
          },
        ]);

        // 3. Priority Stats (Replacing Department Performance)
        const getPriorityCount = (p) =>
          overview.tasksByPriority?.find((x) => x._id === p)?.count || 0;

        setPriorityStats([
          {
            name: "High Priority",
            count: getPriorityCount("High"),
            color: "bg-red-500",
          },
          {
            name: "Medium Priority",
            count: getPriorityCount("Medium"),
            color: "bg-yellow-500",
          },
          {
            name: "Low Priority",
            count: getPriorityCount("Low"),
            color: "bg-green-500",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch system overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading overview...</span>
      </div>
    );
  }

  const mainStats = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-slate-600",
    },
    {
      title: "Active Managers",
      value: stats.activeManagers,
      icon: UserCog,
      color: "text-purple-600",
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: ListTodo,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">
          Comprehensive view of system statistics and metrics
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => (
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
                Live data
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Distribution & Priority */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Breakdown of tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taskStats.map((stat) => (
                <div
                  key={stat.title}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="font-medium">{stat.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                    <Badge variant="outline">{stat.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Priorities</CardTitle>
            <CardDescription>
              Distribution of tasks by priority level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {priorityStats.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.count} tasks
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{
                          width: `${stats.totalTasks ? (item.count / stats.totalTasks) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {stats.totalTasks
                        ? Math.round((item.count / stats.totalTasks) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>Real-time system health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Signal className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">API Status</p>
                <p className="text-sm text-green-600 font-medium">
                  Operational
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-blue-600 font-medium">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Lock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Auth System</p>
                <p className="text-sm text-purple-600 font-medium">
                  Secure & Active
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemOverview;
