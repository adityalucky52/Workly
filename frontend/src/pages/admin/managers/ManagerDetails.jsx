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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Users,
  Calendar,
} from "lucide-react";

const managerData = {
  id: 1,
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "+1 555-0101",
  department: "Engineering",
  status: "Active",
  joinedAt: "2023-05-15",
};

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    status: "Active",
    tasksCompleted: 25,
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Designer",
    status: "Active",
    tasksCompleted: 18,
  },
  {
    id: 3,
    name: "Alex Wilson",
    email: "alex@example.com",
    role: "Developer",
    status: "Active",
    tasksCompleted: 22,
  },
  {
    id: 4,
    name: "Sam Taylor",
    email: "sam@example.com",
    role: "QA Engineer",
    status: "Pending",
    tasksCompleted: 15,
  },
];

const ManagerDetails = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/managers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Details</h1>
          <p className="text-muted-foreground">
            View manager information and team
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Manager Profile */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`/avatars/${id}.jpg`} />
                <AvatarFallback className="text-2xl">JS</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{managerData.name}</h2>
              <p className="text-muted-foreground">
                {managerData.department} Manager
              </p>
              <Badge className="mt-2">{managerData.status}</Badge>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{managerData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{managerData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{managerData.department}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {teamMembers.length} team members
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined: {managerData.joinedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Employees reporting to this manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tasks Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
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
                      <Badge
                        variant={
                          member.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.tasksCompleted}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDetails;
