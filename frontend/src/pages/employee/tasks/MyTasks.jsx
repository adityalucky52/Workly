import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Eye,
  CheckCircle2,
  Clock,
  ListTodo,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { employeeAPI } from "../../../services/api";

const MyTasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getMyTasks({ limit: 1000 });
        if (response.data.success) {
          const processedTasks = response.data.data.map((t) => {
            // Overdue detection
            let status = t.status;
            if (
              status !== "completed" &&
              status !== "cancelled" &&
              t.dueDate &&
              new Date(t.dueDate) < new Date()
            ) {
              status = "overdue";
            }
            return { ...t, status };
          });
          setTasks(processedTasks);
        }
      } catch (error) {
        console.error("Failed to fetch my tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading tasks...</span>
      </div>
    );
  }

  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const getStatusBadge = (status) => {
    let variant = "secondary";
    if (status === "completed") variant = "default"; // or green custom
    if (status === "in-progress") variant = "default";
    if (status === "overdue") variant = "destructive";

    // Format for display (e.g. "in-progress" -> "In Progress")
    const displayStatus = status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return <Badge variant={variant}>{displayStatus}</Badge>;
  };

  const TaskTable = ({ taskList }) =>
    taskList.length === 0 ? (
      <div className="text-center py-8 text-muted-foreground">
        No tasks in this category.
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assigned By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskList.map((task) => (
            <TableRow key={task._id}>
              <TableCell className="font-medium">{task.title}</TableCell>
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
                  {task.priority || "Medium"}
                </Badge>
              </TableCell>
              <TableCell>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell>
                {task.createdBy
                  ? `${task.createdBy.firstName} ${task.createdBy.lastName}`
                  : "System"}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/employee/tasks/${task._id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            View and manage your assigned tasks
          </p>
        </div>
        {/* 
        <Button asChild>
          <Link to="/employee/tasks/update">Update Status</Link>
        </Button>
         */}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inProgressTasks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedTasks.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="progress">
                In Progress ({inProgressTasks.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <TaskTable taskList={tasks} />
            </TabsContent>

            <TabsContent value="progress" className="mt-4">
              <TaskTable taskList={inProgressTasks} />
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <TaskTable taskList={pendingTasks} />
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <TaskTable taskList={completedTasks} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTasks;
