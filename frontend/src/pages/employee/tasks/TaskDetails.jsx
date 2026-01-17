import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  UserCog,
  Flag,
  Clock,
  MessageSquare,
} from "lucide-react";

const taskData = {
  id: 1,
  title: "Complete API documentation",
  description:
    "Write comprehensive documentation for all API endpoints. Include authentication methods, request/response formats, error codes, and usage examples for each endpoint.",
  manager: { name: "Jane Smith", email: "jane@example.com" },
  status: "In Progress",
  priority: "High",
  createdAt: "2024-01-15",
  dueDate: "2024-01-30",
};

const comments = [
  {
    id: 1,
    user: "Jane Smith",
    message: "Please prioritize the auth endpoints first",
    time: "2024-01-20 10:30",
  },
  {
    id: 2,
    user: "John Doe",
    message: "Started working on auth docs",
    time: "2024-01-20 11:00",
  },
];

const TaskDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/employee/tasks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
          <p className="text-muted-foreground">View task information</p>
        </div>
        <Badge
          variant={taskData.status === "In Progress" ? "default" : "secondary"}
        >
          {taskData.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{taskData.title}</CardTitle>
              <CardDescription>Task ID: #{id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{taskData.description}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-4 pb-4 border-b last:border-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{comment.user}</p>
                        <span className="text-xs text-muted-foreground">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flag className="h-4 w-4" />
                  Priority
                </div>
                <Badge variant="destructive">{taskData.priority}</Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>
                <span className="font-medium">{taskData.dueDate}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Created
                </div>
                <span className="font-medium">{taskData.createdAt}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Assigned By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{taskData.manager.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {taskData.manager.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" asChild>
            <Link to="/employee/tasks/update">Update Status</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
