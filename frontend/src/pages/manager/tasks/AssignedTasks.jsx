import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ListTodo,
} from "lucide-react";
import { managerAPI } from "../../../services/api";

const AssignedTasks = () => {
  const [searchParams] = useSearchParams();
  const initialAssigneeFilter = searchParams.get("assignee") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await managerAPI.getAssignedTasks({ limit: 1000 });
        if (response.data.success) {
          const rawTasks = response.data.data;

          // Process tasks (e.g. detect overdue)
          const processedTasks = rawTasks.map((task) => {
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

          setTasks(processedTasks);
        }
      } catch (error) {
        console.error("Failed to fetch assigned tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.firstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      task.assignee?.lastName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesAssigneeParam = initialAssigneeFilter
      ? task.assignee?._id === initialAssigneeFilter
      : true;

    return matchesSearch && matchesAssigneeParam;
  });

  const getStatusBadge = (status) => {
    const config = {
      Completed: { variant: "outline", icon: CheckCircle2 },
      "In Progress": { variant: "default", icon: Clock },
      Pending: { variant: "secondary", icon: AlertCircle }, // Or generic icon
      Overdue: { variant: "destructive", icon: AlertCircle },
    };

    // Default fallback
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

  // Calculate dynamic stats from filtered or all tasks
  // Usually stats show "Total" context, so using 'tasks' (all fetched) not 'filteredTasks'
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    overdue: tasks.filter((t) => t.status === "Overdue").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Loading assigned tasks...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assigned Tasks</h1>
        <p className="text-muted-foreground">
          Tasks assigned to your team members
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
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
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Assigned Tasks</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks or assignee..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
              <p>Create tasks for your team to see them here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell
                      className="font-medium max-w-[200px] truncate"
                      title={task.title}
                    >
                      {task.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={task.assignee?.avatar} />
                          <AvatarFallback className="text-xs">
                            {task.assignee?.firstName?.[0]}
                            {task.assignee?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {task.assignee
                            ? `${task.assignee.firstName} ${task.assignee.lastName}`
                            : "Unassigned"}
                        </span>
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
                        {task.priority || "Medium"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
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

export default AssignedTasks;
