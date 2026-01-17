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
import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";

const history = [
  {
    id: 1,
    task: "Database optimization",
    action: "Completed",
    date: "2024-01-20",
    time: "14:30",
  },
  {
    id: 2,
    task: "Fix login bug",
    action: "Started",
    date: "2024-01-19",
    time: "09:15",
  },
  {
    id: 3,
    task: "Write unit tests",
    action: "Status updated to Pending",
    date: "2024-01-18",
    time: "16:45",
  },
  {
    id: 4,
    task: "Update API endpoints",
    action: "Completed",
    date: "2024-01-17",
    time: "11:20",
  },
  {
    id: 5,
    task: "Code review",
    action: "Completed",
    date: "2024-01-16",
    time: "15:00",
  },
  {
    id: 6,
    task: "Bug fix for dashboard",
    action: "Started",
    date: "2024-01-15",
    time: "10:00",
  },
  {
    id: 7,
    task: "Bug fix for dashboard",
    action: "Completed",
    date: "2024-01-15",
    time: "17:30",
  },
];

const getActionIcon = (action) => {
  if (action === "Completed")
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (action === "Started") return <Clock className="h-4 w-4 text-blue-500" />;
  return <ArrowRight className="h-4 w-4 text-yellow-500" />;
};

const getActionBadge = (action) => {
  if (action === "Completed")
    return <Badge variant="secondary">Completed</Badge>;
  if (action === "Started") return <Badge variant="default">Started</Badge>;
  return <Badge variant="outline">Updated</Badge>;
};

const TaskHistory = () => {
  const completedCount = history.filter((h) => h.action === "Completed").length;
  const startedCount = history.filter((h) => h.action === "Started").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task History</h1>
        <p className="text-muted-foreground">View your task activity history</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
            <p className="text-xs text-muted-foreground">this month</p>
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
            <CardTitle className="text-sm font-medium">Tasks Started</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {startedCount}
            </div>
            <p className="text-xs text-muted-foreground">tasks begun</p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Your recent task activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Date</TableHead>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskHistory;
