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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  History,
} from "lucide-react";
import { employeeAPI } from "../../../services/api";

const getActionIcon = (action) => {
  if (action === "Completed")
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (action === "Started" || action === "In Progress")
    return <Clock className="h-4 w-4 text-blue-500" />;
  return <ArrowRight className="h-4 w-4 text-yellow-500" />;
};

const getActionBadge = (action) => {
  if (action === "Completed")
    return <Badge variant="secondary">Completed</Badge>;
  if (action === "Started" || action === "In Progress")
    return <Badge variant="default">In Progress</Badge>;
  return <Badge variant="outline">{action}</Badge>;
};

const TaskHistory = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Using getMyTasks as a proxy for history if specific history endpoint returns empty or complex structure
        // But let's try getTaskHistory first if it exists in backend controller
        // Actually, let's use getMyTasks and sort by updatedAt to show "Recent Activity"
        // This is safer given I haven't implemented a full Activity Log System in backend yet.
        const response = await employeeAPI.getMyTasks({ limit: 100 });

        if (response.data.success) {
          // We will treat every task update as a history item based on status
          const tasks = response.data.data;
          const sortedTasks = tasks.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );

          const historyItems = sortedTasks.map((t) => ({
            id: t._id,
            task: t.title,
            action: t.status, // Current status as the "action"
            date: new Date(t.updatedAt).toLocaleDateString(),
            time: new Date(t.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setHistory(historyItems);
        }
      } catch (error) {
        console.error("Failed to fetch task history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const completedCount = history.filter((h) => h.action === "Completed").length;
  // Count anything not completed as active/started for this view
  const startedCount = history.filter((h) => h.action !== "Completed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task History</h1>
        <p className="text-muted-foreground">
          View your task activity history (Recent Updates)
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
            <p className="text-xs text-muted-foreground">recent updates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedCount}
            </div>
            <p className="text-xs text-muted-foreground">tasks finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active / In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {startedCount}
            </div>
            <p className="text-xs text-muted-foreground">currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Your recent task states</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No history available yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Last Updated Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(item.action)}
                        <span className="font-medium">{item.task}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(item.action)}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskHistory;
