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
import { Badge } from "../../../components/ui/badge";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { CheckCircle2, Clock, Pause, Save } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Complete API documentation",
    currentStatus: "In Progress",
    priority: "High",
  },
  {
    id: 2,
    title: "Write unit tests",
    currentStatus: "Pending",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Fix login bug",
    currentStatus: "In Progress",
    priority: "High",
  },
];

const UpdateStatus = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating status:", { selectedTask, newStatus, notes });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Update Task Status
        </h1>
        <p className="text-muted-foreground">Update the status of your tasks</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
            <CardDescription>
              Select a task and update its status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label className="text-sm font-medium">New Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  placeholder="Add any notes about this update..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={!selectedTask || !newStatus}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/employee/tasks">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Status Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Status Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Pause className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Pending</p>
                <p className="text-xs text-muted-foreground">
                  Task not yet started
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">In Progress</p>
                <p className="text-xs text-muted-foreground">
                  Currently working on it
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Completed</p>
                <p className="text-xs text-muted-foreground">
                  Task is finished
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Your Active Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">{task.title}</h3>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        task.priority === "High" ? "destructive" : "default"
                      }
                    >
                      {task.priority}
                    </Badge>
                    <Badge
                      variant={
                        task.currentStatus === "In Progress"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {task.currentStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateStatus;
