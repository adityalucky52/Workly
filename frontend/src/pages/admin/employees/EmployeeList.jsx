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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Eye,
  ArrowRightLeft,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  UserCheck,
  UserX,
  Users,
  Mail,
} from "lucide-react";
import { adminAPI } from "../../../services/api";

const EmployeeList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllEmployees();
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Approve employee
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      const response = await adminAPI.approveEmployee(id);
      if (response.data.success) {
        setEmployees((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: "Active" } : e)),
        );
      }
    } catch (err) {
      console.error("Failed to approve employee:", err);
      alert("Failed to approve employee. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject employee
  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      const response = await adminAPI.rejectEmployee(id);
      if (response.data.success) {
        setEmployees((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: "Inactive" } : e)),
        );
      }
    } catch (err) {
      console.error("Failed to reject employee:", err);
      alert("Failed to reject employee. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter employees based on search and tab
  const getFilteredEmployees = () => {
    let filtered = employees;

    // Filter by tab
    if (activeTab === "pending") {
      filtered = filtered.filter((e) => e.status === "Pending");
    } else if (activeTab === "active") {
      filtered = filtered.filter((e) => e.status === "Active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((e) => e.status === "Inactive");
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (emp) =>
          `${emp.firstName} ${emp.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const filteredEmployees = getFilteredEmployees();

  // Stats
  const stats = {
    total: employees.length,
    pending: employees.filter((e) => e.status === "Pending").length,
    active: employees.filter((e) => e.status === "Active").length,
    inactive: employees.filter((e) => e.status === "Inactive").length,
    totalTasks: employees.reduce((sum, e) => sum + (e.totalTasks || 0), 0),
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "Inactive":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <XCircle className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading employees...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchEmployees}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            View and manage all employees in the system
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pending Approval
            </CardDescription>
            <CardTitle className="text-2xl text-yellow-500">
              {stats.pending}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-500/30">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Active Employees
            </CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {stats.active}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks Assigned</CardDescription>
            <CardTitle className="text-2xl">{stats.totalTasks}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Employees Table with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Employees</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending" className="text-yellow-600">
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-green-600">
                Active ({stats.active})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-red-600">
                Inactive ({stats.inactive})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No employees found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback>
                                {employee.firstName?.[0]}
                                {employee.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {employee.firstName} {employee.lastName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {employee.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {employee.manager ? (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {employee.manager.firstName}{" "}
                              {employee.manager.lastName}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Not assigned
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {employee.totalTasks || 0} tasks
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(employee.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Approve/Reject buttons for pending employees */}
                            {employee.status === "Pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApprove(employee._id)}
                                  disabled={actionLoading === employee._id}
                                >
                                  {actionLoading === employee._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(employee._id)}
                                  disabled={actionLoading === employee._id}
                                >
                                  {actionLoading === employee._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <UserX className="h-4 w-4 mr-1" />
                                      Reject
                                    </>
                                  )}
                                </Button>
                              </>
                            )}

                            {/* Re-activate button for inactive employees */}
                            {employee.status === "Inactive" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApprove(employee._id)}
                                disabled={actionLoading === employee._id}
                              >
                                {actionLoading === employee._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Activate
                                  </>
                                )}
                              </Button>
                            )}

                            {/* Deactivate button for active employees */}
                            {employee.status === "Active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                onClick={() => handleReject(employee._id)}
                                disabled={actionLoading === employee._id}
                              >
                                {actionLoading === employee._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <UserX className="h-4 w-4 mr-1" />
                                    Deactivate
                                  </>
                                )}
                              </Button>
                            )}

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
                                  <Link to={`/admin/employees/${employee._id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/admin/employees/${employee._id}/transfer`}
                                  >
                                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                                    Transfer
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeList;
