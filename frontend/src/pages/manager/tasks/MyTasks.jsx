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
  PlusCircle,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { managerAPI } from "../../../services/api";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await managerAPI.getMyTasks({ limit: 1000 });
        if (response.data.success) {
          const fetchedTasks = response.data.data.map((task) => {
            // Overdue check
            let status = task.status;
            if (
              status !== "Completed" &&
              status !== "Cancelled" &&
              task.dueDate &&
              new Date(task.dueDate) < new Date()
            ) {
              status = "Overdue";
            }
            return { ...task, status };
          });
          setTasks(fetchedTasks);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const inProgressCount = tasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  const getStatusBadge = (status) => {
    const config = {
      Completed: { variant: "outline", icon: CheckCircle2 },
      "In Progress": { variant: "default", icon: Clock },
      Pending: { variant: "secondary", icon: ListTodo },
      Overdue: { variant: "destructive", icon: AlertCircle },
    };
    const { variant, icon: Icon } = config[status] || {
      variant: "secondary",
      icon: null,
    };
    return (
      <Badge variant={variant} className="flex w-fit items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">Tasks assigned to you</p>
        </div>
        <Button asChild>
          <Link to="/manager/tasks/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Task
          </Link>
        </Button>
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
              {inProgressCount}
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
              {completedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardContent className="pt-6">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">
                No tasks assigned to you
              </h3>
              <p>When tasks are assigned to you, they will appear here.</p>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
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
                      <TableRow key={task._id}>
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.priority === "High"
                                ? "destructive"
                                : "default"
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
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="progress" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks
                      .filter((t) => t.status === "In Progress")
                      .map((task) => (
                        <TableRow key={task._id}>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.priority === "High"
                                  ? "destructive"
                                  : "default"
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
                        </TableRow>
                      ))}
                    {tasks.filter((t) => t.status === "In Progress").length ===
                      0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          No tasks in progress.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks
                      .filter((t) => t.status === "Completed")
                      .map((task) => (
                        <TableRow key={task._id}>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.priority === "High"
                                  ? "destructive"
                                  : "default"
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
                        </TableRow>
                      ))}
                    {tasks.filter((t) => t.status === "Completed").length ===
                      0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          No completed tasks.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTasks;
