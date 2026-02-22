import { useState, useEffect } from "react";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  UserCog,
  Flag,
  Clock,
  MessageSquare,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { employeeAPI } from "../../../services/api";

const TaskDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch task details
        const taskRes = await employeeAPI.getTaskById(id);

        if (taskRes.data.success) {
          setTask(taskRes.data.data);

          // Assuming comments might be a separate call or included.
          // If the API has getTaskComments, let's try to verify if it works or if comments are in task object.
          // Based on previous API definition: getTaskComments: (id) => api.get(`/employee/tasks/${id}/comments`),
          try {
            // Let's assume for now we don't have comments fully built or it returns empty array
            // But we will setup the state
            // const commentsRes = await employeeAPI.getTaskComments(id);
            // if (commentsRes.data.success) setComments(commentsRes.data.data);
            // Since I haven't verified backend for comments, I'll stick to what might be in task or leave empty
            if (taskRes.data.data.comments) {
              setComments(taskRes.data.data.comments);
            }
          } catch (cErr) {
            // Comments fetch optional/failed
          }
        } else {
          setError("Task not found");
        }
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Loading task details...
        </span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive opacity-50" />
        <p className="text-muted-foreground">{error || "Task not found"}</p>
        <Button variant="outline" asChild>
          <Link to="/employee/tasks">Back to Tasks</Link>
        </Button>
      </div>
    );
  }

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
          variant={
            task.status === "in-progress"
              ? "default"
              : task.status === "completed"
                ? "outline"
                : "secondary"
          }
        >
          {task.status
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>
                Task ID: #{task._id?.substring(0, 8)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          {/* Comments - Placeholder structure since backend comments might not be fully ready */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No comments yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment._id || comment.id}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user?.avatar} />
                        <AvatarFallback>
                          {comment.user?.firstName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {comment.user?.firstName} {comment.user?.lastName}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {comment.content || comment.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <Badge
                  variant={
                    task.priority === "High" ? "destructive" : "secondary"
                  }
                >
                  {task.priority}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>
                <span className="font-medium">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Created
                </div>
                <span className="font-medium">
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString()
                    : "-"}
                </span>
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
                  <AvatarImage src={task.createdBy?.avatar} />
                  <AvatarFallback className="text-xs">
                    {task.createdBy?.firstName?.[0]}
                    {task.createdBy?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {task.createdBy
                      ? `${task.createdBy.firstName} ${task.createdBy.lastName}`
                      : "System Admin"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.createdBy?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" asChild>
            {/* We can pass state to pre-fill the update form or just use ID */}
            <Link to={`/employee/tasks/update?taskId=${task._id}`}>
              Update Status
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
