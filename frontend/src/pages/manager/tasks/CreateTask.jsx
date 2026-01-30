import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { managerAPI } from "../../../services/api";
// import { toast } from "sonner"; // Assuming sonner is used for toasts, if not, simple alert or check existing usage

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [fetchingTeam, setFetchingTeam] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "",
    dueDate: "",
  });

  useEffect(() => {
    // Fetch team members for assignment
    const fetchTeam = async () => {
      try {
        const response = await managerAPI.getTeamMembers();
        if (response.data.success) {
          setTeamMembers(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      } finally {
        setFetchingTeam(false);
      }
    };
    fetchTeam();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Backend expects: title, description, assignee (userId), priority, dueDate
      const payload = {
        ...formData,
        // If assignee is empty string, send null or omit? API likely needs assignee.
        assignee: formData.assignee || undefined,
      };

      const response = await managerAPI.createTask(payload);

      if (response.data.success) {
        // Redirect to Assigned Tasks
        navigate("/manager/tasks/assigned");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      // Ideally show toast error here
      alert("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/manager/tasks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Task</h1>
          <p className="text-muted-foreground">
            Assign a new task to your team
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
                <CardDescription>Enter the task information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
                <CardDescription>Assign to team member</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select
                      value={formData.assignee}
                      onValueChange={(value) => handleChange("assignee", value)}
                      disabled={fetchingTeam}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            fetchingTeam
                              ? "Loading team..."
                              : "Select team member"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member._id} value={member._id}>
                            {member.firstName} {member.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleChange("priority", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Task
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link to="/manager/tasks">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
