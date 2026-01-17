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
import { Search, MoreHorizontal, Eye, ListTodo, Mail } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    activeTasks: 5,
    completed: 28,
    workload: 75,
    status: "Active",
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Designer",
    activeTasks: 3,
    completed: 32,
    workload: 55,
    status: "Active",
  },
  {
    id: 3,
    name: "Alex Wilson",
    email: "alex@example.com",
    role: "Developer",
    activeTasks: 7,
    completed: 24,
    workload: 90,
    status: "Busy",
  },
  {
    id: 4,
    name: "Sam Taylor",
    email: "sam@example.com",
    role: "QA Engineer",
    activeTasks: 2,
    completed: 35,
    workload: 40,
    status: "Active",
  },
  {
    id: 5,
    name: "Lisa Brown",
    email: "lisa@example.com",
    role: "Developer",
    activeTasks: 4,
    completed: 21,
    workload: 65,
    status: "Active",
  },
];

const TeamOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            <CardTitle className="text-2xl">{teamMembers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {teamMembers.filter((m) => m.status === "Active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Active Tasks</CardDescription>
            <CardTitle className="text-2xl">
              {teamMembers.reduce((sum, m) => sum + m.activeTasks, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Workload</CardDescription>
            <CardTitle className="text-2xl">
              {Math.round(
                teamMembers.reduce((sum, m) => sum + m.workload, 0) /
                  teamMembers.length,
              )}
              %
            </CardTitle>
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
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
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
                      <Progress value={member.workload} className="w-16 h-2" />
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
                          <Link to={`/manager/team/${member.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ListTodo className="mr-2 h-4 w-4" />
                          View Tasks
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamOverview;
