import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Eye,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  Loader2,
  Calendar,
} from "lucide-react";
import { adminAPI } from "../../../services/api";

const getStatusBadge = (status) => {
  const config = {
    "In Progress": { variant: "default", icon: Clock },
    Pending: { variant: "secondary", icon: ListTodo },
    Completed: { variant: "outline", icon: CheckCircle2 },
    Overdue: { variant: "destructive", icon: AlertCircle },
  };
  const { variant } = config[status] || { variant: "default" };
  return <Badge variant={variant}>{status}</Badge>;
};

const getPriorityBadge = (priority) => {
  const variants = { High: "destructive", Medium: "default", Low: "secondary" };
  return <Badge variant={variants[priority] || "default"}>{priority}</Badge>;
};

const AllTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getAllTasks({ limit: 100 });
        if (response.data.success) {
          // Add overdue status check
          const tasksWithStatus = response.data.data.map((task) => {
            if (
              task.status !== "Completed" &&
              task.dueDate &&
              new Date(task.dueDate) < new Date()
            ) {
              return { ...task, status: "Overdue" };
            }
            return task;
          });
          setTasks(tasksWithStatus);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${task.assignee?.firstName} ${task.assignee?.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const tasksByStatus = (status) =>
    filteredTasks.filter((t) => t.status === status);

  const getAssigneeName = (assignee) => {
    if (!assignee) return "Unassigned";
    return (
      `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim() ||
      "Unknown"
    );
  };

  const getManagerName = (createdBy) => {
    if (!createdBy) return "N/A";
    return (
      `${createdBy.firstName || ""} ${createdBy.lastName || ""}`.trim() ||
      "Unknown"
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
        <p className="text-muted-foreground">
          View and manage all tasks in the system
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
              {tasks.filter((t) => t.status === "In Progress").length}
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
              {tasks.filter((t) => t.status === "Completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {tasks.filter((t) => t.status === "Overdue").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button asChild>
                <Link to="/admin/tasks/create">Create Task</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ListTodo className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
              <p>Tasks will appear here once managers create them.</p>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">
                  All ({filteredTasks.length})
                </TabsTrigger>
                <TabsTrigger value="progress">
                  In Progress ({tasksByStatus("In Progress").length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({tasksByStatus("Pending").length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({tasksByStatus("Completed").length})
                </TabsTrigger>
                <TabsTrigger value="overdue">
                  Overdue ({tasksByStatus("Overdue").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task._id}>
                        <TableCell className="font-medium max-w-[200px]">
                          <p className="truncate">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {task.description}
                            </p>
                          )}
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
                              {getAssigneeName(task.assignee)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getManagerName(task.createdBy)}
                        </TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "No due date"}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/tasks/${task._id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {["progress", "pending", "completed", "overdue"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasksByStatus(
                        tab === "progress"
                          ? "In Progress"
                          : tab === "pending"
                            ? "Pending"
                            : tab === "completed"
                              ? "Completed"
                              : "Overdue",
                      ).map((task) => (
                        <TableRow key={task._id}>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell>
                            {getAssigneeName(task.assignee)}
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(task.priority)}
                          </TableCell>
                          <TableCell>
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/admin/tasks/${task._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {tasksByStatus(
                        tab === "progress"
                          ? "In Progress"
                          : tab === "pending"
                            ? "Pending"
                            : tab === "completed"
                              ? "Completed"
                              : "Overdue",
                      ).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No tasks in this category
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllTasks;
