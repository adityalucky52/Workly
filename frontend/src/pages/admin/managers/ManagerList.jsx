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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Search, MoreHorizontal, Eye, Users, Mail, Phone } from "lucide-react";

const managers = [
  {
    id: 1,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 555-0101",
    department: "Engineering",
    teamSize: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Tom Brown",
    email: "tom@example.com",
    phone: "+1 555-0102",
    department: "Marketing",
    teamSize: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 555-0103",
    department: "Sales",
    teamSize: 15,
    status: "Active",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 555-0104",
    department: "HR",
    teamSize: 6,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Chris Davis",
    email: "chris@example.com",
    phone: "+1 555-0105",
    department: "Finance",
    teamSize: 10,
    status: "Active",
  },
];

const ManagerList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredManagers = managers.filter(
    (manager) =>
      manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Managers</h1>
        <p className="text-muted-foreground">
          View and manage all managers in the system
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Managers</CardDescription>
            <CardTitle className="text-2xl">{managers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Managers</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {managers.filter((m) => m.status === "Active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Team Members</CardDescription>
            <CardTitle className="text-2xl">
              {managers.reduce((sum, m) => sum + m.teamSize, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Managers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Managers</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search managers..."
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
                <TableHead>Manager</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Team Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManagers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/avatars/${manager.id}.jpg`} />
                        <AvatarFallback>
                          {manager.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{manager.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {manager.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {manager.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{manager.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {manager.teamSize} members
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        manager.status === "Active" ? "default" : "outline"
                      }
                    >
                      {manager.status}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/managers/${manager.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Team
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

export default ManagerList;
