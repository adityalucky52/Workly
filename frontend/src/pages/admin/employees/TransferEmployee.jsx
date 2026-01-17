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
import { ArrowLeft, ArrowRightLeft, ArrowRight } from "lucide-react";

const employee = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  currentDepartment: "Engineering",
  currentManager: "Jane Smith",
};

const departments = [
  {
    id: 1,
    name: "Engineering",
    managers: [
      { id: 1, name: "Jane Smith" },
      { id: 2, name: "Bob Lee" },
    ],
  },
  { id: 2, name: "Marketing", managers: [{ id: 3, name: "Tom Brown" }] },
  { id: 3, name: "Sales", managers: [{ id: 4, name: "Mike Johnson" }] },
  { id: 4, name: "HR", managers: [{ id: 5, name: "Sarah Williams" }] },
];

const TransferEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedManager, setSelectedManager] = useState("");

  const availableManagers =
    departments.find((d) => d.name === selectedDepartment)?.managers || [];

  const handleTransfer = () => {
    console.log("Transferring to:", {
      department: selectedDepartment,
      manager: selectedManager,
    });
    navigate(`/admin/employees/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/admin/employees/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Transfer Employee
          </h1>
          <p className="text-muted-foreground">
            Move employee to a different department or manager
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Current Assignment</CardTitle>
            <CardDescription>Employee's current position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {employee.email}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <Badge variant="outline">{employee.currentDepartment}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manager</span>
                <span className="font-medium">{employee.currentManager}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center">
          <ArrowRight className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* New Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>New Assignment</CardTitle>
            <CardDescription>Select new department and manager</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Manager</label>
              <Select
                value={selectedManager}
                onValueChange={setSelectedManager}
                disabled={!selectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {availableManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.name}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleTransfer}
              disabled={!selectedDepartment || !selectedManager}
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Confirm Transfer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransferEmployee;
