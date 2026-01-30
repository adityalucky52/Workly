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
import { Progress } from "../../../components/ui/progress";
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
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  ListTodo,
  Mail,
  Loader2,
  Users,
} from "lucide-react";
import { managerAPI } from "../../../services/api";

const TeamOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        // Assuming getting team members also brings their tasks or we might need
        // to fetch tasks and calculate stats manually like in Admin Workload Report.
        // For Manager, let's see what getTeamMembers returns.
        // If it returns simple list, we'll fetch assigned tasks to calculate workload.

        const [teamRes, taskRes] = await Promise.all([
          managerAPI.getTeamMembers(),
          managerAPI.getAssignedTasks({ limit: 1000 }),
        ]);

        if (teamRes.data.success) {
          const members = teamRes.data.data;
          const tasks = taskRes.data.success ? taskRes.data.data : [];

          // Calculate stats for each member
          const membersWithStats = members.map((member) => {
            const memberTasks = tasks.filter(
              (t) => t.assignee?._id === member._id,
            );
            const activeTasks = memberTasks.filter(
              (t) => t.status !== "Completed" && t.status !== "Cancelled",
            ).length;
            const completedTasks = memberTasks.filter(
              (t) => t.status === "Completed",
            ).length;

            // Simple workload calculation
            let workload = Math.round((activeTasks / 5) * 100);
            if (workload > 100) workload = 100;

            return {
              ...member,
              activeTasks,
              completed: completedTasks,
              workload,
              role: "Employee", // Role is usually employee for team members
            };
          });

          setTeamMembers(membersWithStats);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.status === "Active").length,
    totalActiveTasks: teamMembers.reduce((sum, m) => sum + m.activeTasks, 0),
    avgWorkload: teamMembers.length
      ? Math.round(
          teamMembers.reduce((sum, m) => sum + m.workload, 0) /
            teamMembers.length,
        )
      : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading team...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
        <p className="text-muted-foreground">
          Manage and monitor your team members
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Team Size</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Members</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {stats.active}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Active Tasks</CardDescription>
            <CardTitle className="text-2xl">{stats.totalActiveTasks}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Workload</CardDescription>
            <CardTitle className="text-2xl">{stats.avgWorkload}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Team Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">
                No team members found
              </h3>
              <p>Team members assigned to you will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Active Tasks</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Workload</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.firstName?.[0]}
                            {member.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.activeTasks}</Badge>
                    </TableCell>
                    <TableCell>{member.completed}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={member.workload}
                          className="w-16 h-2"
                        />
                        <span
                          className={`text-sm ${member.workload >= 80 ? "text-red-600" : ""}`}
                        >
                          {member.workload}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/manager/team/${member._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/manager/tasks/assigned?assignee=${member._id}`}
                            >
                              <ListTodo className="mr-2 h-4 w-4" />
                              View Tasks
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamOverview;
