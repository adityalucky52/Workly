import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Send, MessageSquare } from "lucide-react";

const tasks = [
  { id: 1, title: "Complete API documentation" },
  { id: 2, title: "Write unit tests" },
  { id: 3, title: "Fix login bug" },
];

const comments = [
  {
    id: 1,
    task: "Complete API documentation",
    user: "Jane Smith",
    role: "Manager",
    message:
      "Please prioritize the auth endpoints first. Let me know if you need any clarification.",
    time: "2024-01-20 10:30",
    isOwn: false,
  },
  {
    id: 2,
    task: "Complete API documentation",
    user: "John Doe",
    role: "You",
    message:
      "Started working on auth docs. Will have the first draft ready by tomorrow.",
    time: "2024-01-20 11:00",
    isOwn: true,
  },
  {
    id: 3,
    task: "Fix login bug",
    user: "Jane Smith",
    role: "Manager",
    message: "This is a high priority bug. Please fix it as soon as possible.",
    time: "2024-01-19 14:00",
    isOwn: false,
  },
];

const Comments = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [newComment, setNewComment] = useState("");

  const filteredComments = selectedTask
    ? comments.filter(
        (c) =>
          c.task === tasks.find((t) => t.id.toString() === selectedTask)?.title,
      )
    : comments;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding comment:", { selectedTask, newComment });
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
        <p className="text-muted-foreground">
          View and add comments on your tasks
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Comments List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Task Comments</CardTitle>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id.toString()}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`flex gap-4 p-4 rounded-lg ${
                    comment.isOwn ? "bg-primary/5 ml-8" : "bg-muted/50 mr-8"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {comment.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user}</span>
                        <Badge
                          variant={comment.isOwn ? "default" : "secondary"}
                        >
                          {comment.role}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      on: {comment.task}
                    </p>
                    <p className="text-sm">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Comment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Add Comment
            </CardTitle>
            <CardDescription>Post a comment on a task</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Task</label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id.toString()}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Comment</label>
                <Textarea
                  placeholder="Type your comment..."
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedTask || !newComment}
              >
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Comments;
