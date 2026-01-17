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
import { ArrowLeft, Calendar, User, Flag, Clock, Pencil } from "lucide-react";

const taskData = {
  id: 1,
  title: "Complete API documentation",
  description:
    "Write comprehensive documentation for all API endpoints including authentication, error handling, and usage examples.",
  assignee: { name: "John Doe", email: "john@example.com" },
  status: "In Progress",
  priority: "High",
  createdAt: "2024-01-15",
  dueDate: "2024-01-30",
};

const activityLog = [
  {
    id: 1,
    action: "Status updated to In Progress",
    user: "John Doe",
    time: "2024-01-20 10:30",
  },
  {
    id: 2,
    action: "Task assigned to John Doe",
    user: "Jane Smith",
    time: "2024-01-15 14:00",
  },
  {
    id: 3,
    action: "Task created",
    user: "Jane Smith",
    time: "2024-01-15 13:45",
  },
];

const TaskDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/manager/tasks/assigned">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
            <p className="text-muted-foreground">View and manage task</p>
          </div>
        </div>
        <Button>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Task
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{taskData.title}</CardTitle>
                <Badge
                  variant={
                    taskData.status === "In Progress" ? "default" : "secondary"
                  }
                >
                  {taskData.status}
                </Badge>
              </div>
              <CardDescription>Task ID: #{id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{taskData.description}</p>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        by {activity.user}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {activity.time}
                    </span>
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
              <CardTitle>Assignee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{taskData.assignee.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {taskData.assignee.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
