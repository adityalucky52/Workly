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
} from "lucide-react";

const stats = [
  { title: "Total Users", value: "1,234", change: "+12%", icon: Users },
  { title: "Active Managers", value: "48", change: "+4%", icon: UserCog },
  { title: "Active Employees", value: "892", change: "+8%", icon: UserCheck },
  { title: "Total Tasks", value: "2,456", change: "+15%", icon: ListTodo },
];

const taskStats = [
  {
    title: "Completed",
    value: "1,890",
    percentage: 77,
    color: "text-green-600",
  },
  {
    title: "In Progress",
    value: "389",
    percentage: 16,
    color: "text-blue-600",
  },
  { title: "Pending", value: "125", percentage: 5, color: "text-yellow-600" },
  { title: "Overdue", value: "52", percentage: 2, color: "text-red-600" },
];

const departmentStats = [
  { name: "Engineering", users: 245, tasks: 890, completion: 82 },
  { name: "Marketing", users: 128, tasks: 456, completion: 75 },
  { name: "Sales", users: 186, tasks: 678, completion: 88 },
  { name: "HR", users: 67, tasks: 234, completion: 91 },
  { name: "Finance", users: 89, tasks: 345, completion: 79 },
];

const SystemOverview = () => {
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
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Distribution */}
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
                    {stat.title === "Completed" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {stat.title === "In Progress" && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    {stat.title === "Pending" && (
                      <Activity className="h-4 w-4 text-yellow-500" />
                    )}
                    {stat.title === "Overdue" && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
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
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>
              Task completion rates by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.users} users • {dept.tasks} tasks
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${dept.completion}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {dept.completion}%
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
          <CardTitle>System Health</CardTitle>
          <CardDescription>Current system status and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">API Status</p>
                <p className="text-sm text-muted-foreground">
                  All systems operational
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-muted-foreground">
                  Connected, 45ms latency
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Active, 99.9% uptime
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
