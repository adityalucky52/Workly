import { useState } from "react";
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
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
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
} from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Complete project documentation",
    assignee: "John Doe",
    manager: "Jane Smith",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-01-30",
  },
  {
    id: 2,
    title: "Code review for feature X",
    assignee: "Emily Davis",
    manager: "Jane Smith",
    status: "Pending",
    priority: "Medium",
    dueDate: "2024-01-28",
  },
  {
    id: 3,
    title: "Update API endpoints",
    assignee: "Alex Wilson",
    manager: "Tom Brown",
    status: "Completed",
    priority: "High",
    dueDate: "2024-01-20",
  },
  {
    id: 4,
    title: "Write unit tests",
    assignee: "Sam Taylor",
    manager: "Mike Johnson",
    status: "In Progress",
    priority: "Low",
    dueDate: "2024-02-01",
  },
  {
    id: 5,
    title: "Design system update",
    assignee: "Lisa Anderson",
    manager: "Sarah Williams",
    status: "Overdue",
    priority: "High",
    dueDate: "2024-01-15",
  },
  {
    id: 6,
    title: "Performance optimization",
    assignee: "Ryan Moore",
    manager: "Jane Smith",
    status: "Completed",
    priority: "Medium",
    dueDate: "2024-01-22",
  },
];

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

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tasksByStatus = (status) =>
    filteredTasks.filter((t) => t.status === status);

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
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                    <TableHead>Manager</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">
                              {task.assignee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {task.assignee}
                        </div>
                      </TableCell>
                      <TableCell>{task.manager}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
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
                              <Link to={`/admin/tasks/${task.id}`}>
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
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllTasks;
