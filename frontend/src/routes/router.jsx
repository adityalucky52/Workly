import { createBrowserRouter, Navigate } from "react-router-dom";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Admin
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

// Manager
import ManagerLayout from "../layouts/manager/ManagerLayout";
import ManagerDashboard from "../pages/manager/Dashboard";
import TeamOverview from "../pages/manager/team/TeamOverview";
import EmployeeProfile from "../pages/manager/team/EmployeeProfile";
import WorkloadView from "../pages/manager/team/WorkloadView";
import ManagerMyTasks from "../pages/manager/tasks/MyTasks";
import ManagerCreateTask from "../pages/manager/tasks/CreateTask";
import AssignedTasks from "../pages/manager/tasks/AssignedTasks";
import ManagerTaskDetails from "../pages/manager/tasks/TaskDetails";
import TeamPerformance from "../pages/manager/reports/TeamPerformance";
import TaskCompletion from "../pages/manager/reports/TaskCompletion";
import ManagerSettings from "../pages/manager/settings/ManagerSettings";

// Employee
import EmployeeLayout from "../layouts/employee/EmployeeLayout";
import EmployeeDashboard from "../pages/employee/Dashboard";
import EmployeeMyTasks from "../pages/employee/tasks/MyTasks";
import EmployeeTaskDetails from "../pages/employee/tasks/TaskDetails";
import UpdateStatus from "../pages/employee/tasks/UpdateStatus";
import TaskHistory from "../pages/employee/activity/TaskHistory";
import Comments from "../pages/employee/activity/Comments";
import EmployeeSettings from "../pages/employee/settings/EmployeeSettings";

// Common
import NotFound from "../pages/common/NotFound";

// React Router v7 - createBrowserRouter with route objects
export const router = createBrowserRouter([
  // ==================== Auth Routes - Public ====================
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // ==================== Redirect root to login ====================
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // ==================== Admin Routes - Protected ====================
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      // Users
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
      // Managers
      {
        path: "managers",
        element: <ManagerList />,
      },
      {
        path: "managers/:id",
        element: <ManagerDetails />,
      },
      // Employees
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
      // Tasks
      {
        path: "tasks",
        element: <AllTasks />,
      },
      {
        path: "tasks/:id",
        element: <AdminTaskDetails />,
      },
      // Reports
      {
        path: "reports/overview",
        element: <SystemOverview />,
      },
      {
        path: "reports/workload",
        element: <WorkloadReport />,
      },
      // Settings
      {
        path: "settings",
        element: <AdminSettings />,
      },
    ],
  },

  // ==================== Manager Routes - Protected ====================
  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <ManagerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/manager/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <ManagerDashboard />,
      },
      // Team
      {
        path: "team",
        element: <TeamOverview />,
      },
      {
        path: "team/:id",
        element: <EmployeeProfile />,
      },
      {
        path: "team/workload",
        element: <WorkloadView />,
      },
      // Tasks
      {
        path: "tasks",
        element: <ManagerMyTasks />,
      },
      {
        path: "tasks/create",
        element: <ManagerCreateTask />,
      },
      {
        path: "tasks/assigned",
        element: <AssignedTasks />,
      },
      {
        path: "tasks/:id",
        element: <ManagerTaskDetails />,
      },
      // Reports
      {
        path: "reports/performance",
        element: <TeamPerformance />,
      },
      {
        path: "reports/completion",
        element: <TaskCompletion />,
      },
      // Settings
      {
        path: "settings",
        element: <ManagerSettings />,
      },
    ],
  },

  // ==================== Employee Routes - Protected ====================
  {
    path: "/employee",
    element: (
      <ProtectedRoute allowedRoles={["employee"]}>
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/employee/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <EmployeeDashboard />,
      },
      // Tasks
      {
        path: "tasks",
        element: <EmployeeMyTasks />,
      },
      {
        path: "tasks/:id",
        element: <EmployeeTaskDetails />,
      },
      {
        path: "tasks/update",
        element: <UpdateStatus />,
      },
      // Activity
      {
        path: "activity/history",
        element: <TaskHistory />,
      },
      {
        path: "activity/comments",
        element: <Comments />,
      },
      // Settings
      {
        path: "settings",
        element: <EmployeeSettings />,
      },
    ],
  },

  // ==================== 404 - Catch All ====================
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
