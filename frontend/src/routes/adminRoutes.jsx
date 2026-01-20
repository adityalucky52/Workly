import { Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Admin Layout & Pages
import AdminLayout from "../layouts/admin/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AllUsers from "../pages/admin/users/AllUsers";
import CreateUser from "../pages/admin/users/CreateUser";
import UserDetails from "../pages/admin/users/UserDetails";
import AssignManager from "../pages/admin/users/AssignManager";
import ManagerList from "../pages/admin/managers/ManagerList";
import ManagerDetails from "../pages/admin/managers/ManagerDetails";
import AdminEmployeeList from "../pages/admin/employees/EmployeeList";
import AdminEmployeeDetails from "../pages/admin/employees/EmployeeDetails";
import TransferEmployee from "../pages/admin/employees/TransferEmployee";
import AllTasks from "../pages/admin/tasks/AllTasks";
import AdminTaskDetails from "../pages/admin/tasks/TaskDetails";
import SystemOverview from "../pages/admin/reports/SystemOverview";
import WorkloadReport from "../pages/admin/reports/WorkloadReport";
import AdminSettings from "../pages/admin/settings/AdminSettings";

/**
 * Admin Routes Configuration
 * All routes under /admin path
 * Protected with admin role
 */
export const adminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    // Dashboard (default redirect & page)
    {
      index: true,
      element: <Navigate to="/admin/dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <AdminDashboard />,
    },

    // ==================== Users ====================
    {
      path: "users",
      element: <AllUsers />,
    },
    {
      path: "users/create",
      element: <CreateUser />,
    },
    {
      path: "users/:id",
      element: <UserDetails />,
    },
    {
      path: "users/:id/assign-manager",
      element: <AssignManager />,
    },

    // ==================== Managers ====================
    {
      path: "managers",
      element: <ManagerList />,
    },
    {
      path: "managers/:id",
      element: <ManagerDetails />,
    },

    // ==================== Employees ====================
    {
      path: "employees",
      element: <AdminEmployeeList />,
    },
    {
      path: "employees/:id",
      element: <AdminEmployeeDetails />,
    },
    {
      path: "employees/:id/transfer",
      element: <TransferEmployee />,
    },

    // ==================== Tasks ====================
    {
      path: "tasks",
      element: <AllTasks />,
    },
    {
      path: "tasks/:id",
      element: <AdminTaskDetails />,
    },

    // ==================== Reports ====================
    {
      path: "reports/overview",
      element: <SystemOverview />,
    },
    {
      path: "reports/workload",
      element: <WorkloadReport />,
    },

    // ==================== Settings ====================
    {
      path: "settings",
      element: <AdminSettings />,
    },
  ],
};

export default adminRoutes;
