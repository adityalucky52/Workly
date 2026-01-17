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
import { Eye, CheckCircle2, Clock, ListTodo } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Complete API documentation",
    priority: "High",
    dueDate: "2024-01-30",
    status: "In Progress",
    manager: "Jane Smith",
  },
  {
    id: 2,
    title: "Write unit tests",
    priority: "Medium",
    dueDate: "2024-01-28",
    status: "Pending",
    manager: "Jane Smith",
  },
  {
    id: 3,
    title: "Fix login bug",
    priority: "High",
    dueDate: "2024-01-25",
    status: "In Progress",
    manager: "Jane Smith",
  },
  {
    id: 4,
    title: "Update user profile page",
    priority: "Low",
    dueDate: "2024-02-01",
    status: "Pending",
    manager: "Jane Smith",
  },
  {
    id: 5,
    title: "Database optimization",
    priority: "Medium",
    dueDate: "2024-01-20",
    status: "Completed",
    manager: "Jane Smith",
  },
];

const MyTasks = () => {
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  const TaskTable = ({ taskList }) => (
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
          <TableRow key={task.id}>
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
                {task.priority}
              </Badge>
            </TableCell>
            <TableCell>{task.dueDate}</TableCell>
            <TableCell>{task.manager}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/employee/tasks/${task.id}`}>
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
        <Button asChild>
          <Link to="/employee/tasks/update">Update Status</Link>
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
