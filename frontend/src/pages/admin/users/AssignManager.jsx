import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ArrowLeft, UserCog, Check } from "lucide-react";

const managers = [
  { id: 1, name: "Jane Smith", department: "Engineering", teamSize: 12 },
  { id: 2, name: "Tom Brown", department: "Marketing", teamSize: 8 },
  { id: 3, name: "Mike Johnson", department: "Sales", teamSize: 15 },
  { id: 4, name: "Sarah Williams", department: "HR", teamSize: 6 },
];

const currentUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Employee",
  currentManager: "Jane Smith",
};

const AssignManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedManager, setSelectedManager] = useState("");

  const handleAssign = () => {
    navigate(`/admin/users/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/admin/users/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assign Manager</h1>
          <p className="text-muted-foreground">
            Assign a reporting manager to this user
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current User */}
        <Card>
          <CardHeader>
            <CardTitle>User</CardTitle>
            <CardDescription>The user receiving a new manager</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`/avatars/${id}.jpg`} />
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary">{currentUser.role}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Current Manager: {currentUser.currentManager}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Select Manager */}
        <Card>
          <CardHeader>
            <CardTitle>Select Manager</CardTitle>
            <CardDescription>Choose a manager to assign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{manager.name}</span>
                      <span className="text-muted-foreground">
                        ({manager.department})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="w-full"
              onClick={handleAssign}
              disabled={!selectedManager}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Assign Manager
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Managers */}
      <Card>
        <CardHeader>
          <CardTitle>Available Managers</CardTitle>
          <CardDescription>Click to select a manager</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {managers.map((manager) => (
              <Card
                key={manager.id}
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selectedManager === manager.id.toString()
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => setSelectedManager(manager.id.toString())}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {manager.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{manager.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {manager.department}
                        </p>
                      </div>
                    </div>
                    {selectedManager === manager.id.toString() && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline">
                      {manager.teamSize} team members
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

export default AssignManager;
