import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader2,
  ListTodo,
} from "lucide-react";
import { managerAPI } from "../../../services/api";

const TaskCompletion = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    rate: 0,
  });
  const [weeklyStats, setWeeklyStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using getAssignedTasks to see tasks managed by this user
        const response = await managerAPI.getAssignedTasks({ limit: 1000 });

        if (response.data.success) {
          const tasks = response.data.data;

          const total = tasks.length;
          const completed = tasks.filter(
            (t) => t.status === "Completed",
          ).length;
          const inProgress = tasks.filter(
            (t) => t.status === "In Progress",
          ).length;
          // Overdue calculation
          const overdue = tasks.filter(
            (t) =>
              t.status !== "Completed" &&
              t.status !== "Cancelled" &&
              t.dueDate &&
              new Date(t.dueDate) < new Date(),
          ).length;

          const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

          setStats({
            total,
            completed,
            inProgress,
            overdue,
            rate,
          });

          // Weekly Breakdown (Simple grouped by completion or creation date for last 4 weeks)
          // Let's create buckets for last 4 weeks
          const weeks = [];
          for (let i = 3; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i * 7);
            const startOfWeek = new Date(d);
            startOfWeek.setDate(d.getDate() - d.getDay()); // Sunday
            weeks.push({
              label: `Week ${4 - i}`, // Just generic label, or use dates
              start: startOfWeek,
              completed: 0,
              target: 5, // Mock target per week
            });
          }

          // Count completed tasks in buckets
          tasks.forEach((t) => {
            if (t.status === "Completed" && t.updatedAt) {
              const completionDate = new Date(t.updatedAt);
              // Check which week bucket it falls into
              // Simple logic: if within last 28 days
              const now = new Date();
              const diffTime = Math.abs(now - completionDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays <= 28) {
                const weekIndex = Math.floor((28 - diffDays) / 7);
                if (weekIndex >= 0 && weekIndex < 4) {
                  weeks[weekIndex].completed++;
                }
              }
            }
          });

          setWeeklyStats(weeks);
        }
      } catch (error) {
        console.error("Failed to fetch task completion stats:", error);
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
        <span className="ml-2 text-muted-foreground">Loading report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task Completion</h1>
        <p className="text-muted-foreground">
          Track task completion rates and trends
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">all assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.rate}% completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">active tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Completion Rate</CardTitle>
          <CardDescription>All-time task completion progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{stats.rate}%</span>
              <Badge variant="default" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Real-time
              </Badge>
            </div>
            <Progress value={stats.rate} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stats.completed} completed</span>
              <span>{stats.total - stats.completed} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Breakdown (Last 30 Days)</CardTitle>
          <CardDescription>Task completion by week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyStats.map((week, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{week.label}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        week.completed >= week.target
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }
                    >
                      {week.completed} Completed
                    </span>
                    {week.completed >= week.target && (
                      <Badge variant="secondary">High Activity</Badge>
                    )}
                  </div>
                </div>
                {/* Visual bar just proportional to max 10 for scale */}
                <Progress
                  value={Math.min((week.completed / 10) * 100, 100)}
                  className="h-2"
                />
              </div>
            ))}
            {weeklyStats.every((w) => w.completed === 0) && (
              <p className="text-center text-sm text-muted-foreground py-2">
                No completed tasks in the last 30 days.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCompletion;
