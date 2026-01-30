import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
import {
  CheckCircle2,
  Clock,
  Pause,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { employeeAPI } from "../../../services/api";

const UpdateStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preSelectedTaskId = searchParams.get("taskId");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [selectedTask, setSelectedTask] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (preSelectedTaskId) {
      setSelectedTask(preSelectedTaskId);
    }
  }, [preSelectedTaskId]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getMyTasks({ limit: 1000 });
        if (response.data.success) {
          setTasks(response.data.data);
          // If we have a selected task, try to pre-fill its current status
          if (preSelectedTaskId) {
            const task = response.data.data.find(
              (t) => t._id === preSelectedTaskId,
            );
            if (task) {
              setNewStatus(task.status);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [preSelectedTaskId]);

  // When task selection changes manually
  const handleTaskChange = (taskId) => {
    setSelectedTask(taskId);
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      setNewStatus(task.status);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask || !newStatus) return;

    try {
      setSubmitting(true);

      // 1. Update Status
      // Map UI status to backend values if needed. Assuming backend accepts: "Pending", "In Progress", "Completed", "Review"?
      // Backend validStatuses: ["pending", "in-progress", "review", "completed"] (lowercase)
      // But my Badge logic earlier used Title Case. Let's send lowercase or title case depending on what backend expects.
      // Looking at backend code: validStatuses = ["pending", "in-progress", "review", "completed"];
      // It strictly checks lowercase. So I must convert.

      let statusToSend = newStatus.toLowerCase().replace(" ", "-");
      // Handle "Pending" -> "pending", "In Progress" -> "in-progress", "Completed" -> "completed"

      // Wait, current data in DB might be PascalCase. Let's ensure we map consistently.
      if (statusToSend === "in-progress") statusToSend = "in-progress"; // Correct

      await employeeAPI.updateTaskStatus(selectedTask, {
        status: statusToSend,
      });

      // 2. Add Notes as Comment if present
      if (notes.trim()) {
        await employeeAPI.addComment(selectedTask, notes);
      }

      // Show success and redirect or reset
      navigate("/employee/tasks");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                <Select value={selectedTask} onValueChange={handleTaskChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task._id} value={task._id}>
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
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    {/* Add Review if needed */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  placeholder="Add any notes about this update (will be added as a comment)..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!selectedTask || !newStatus || submitting}
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
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
            {tasks
              .filter((t) => t.status !== "Completed")
              .slice(0, 6)
              .map((task) => (
                <Card key={task._id}>
                  <CardContent className="pt-6">
                    <h3
                      className="font-medium mb-2 truncate"
                      title={task.title}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          task.priority === "High" ? "destructive" : "default"
                        }
                      >
                        {task.priority || "Medium"}
                      </Badge>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {tasks.filter((t) => t.status !== "Completed").length === 0 && (
              <p className="text-muted-foreground col-span-3 text-center">
                No active tasks.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateStatus;
