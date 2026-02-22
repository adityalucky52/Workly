import { Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Employee Layout & Pages
import EmployeeLayout from "../layouts/employee/EmployeeLayout";
import EmployeeDashboard from "../pages/employee/Dashboard";
import EmployeeMyTasks from "../pages/employee/tasks/MyTasks";
import EmployeeTaskDetails from "../pages/employee/tasks/TaskDetails";
import UpdateStatus from "../pages/employee/tasks/UpdateStatus";
import TaskHistory from "../pages/employee/activity/TaskHistory";
import EmployeeSettings from "../pages/employee/settings/EmployeeSettings";

/**
 * Employee Routes Configuration
 * All routes under /employee path
 * Protected with employee role
 */
export const employeeRoutes = {
  path: "/employee",
  element: (
    <ProtectedRoute allowedRoles={["employee"]}>
      <EmployeeLayout />
    </ProtectedRoute>
  ),
  children: [
    // Dashboard (default redirect & page)
    {
      index: true,
      element: <Navigate to="/employee/dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <EmployeeDashboard />,
    },

    // ==================== Tasks ====================
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

    // ==================== Activity ====================
    {
      path: "activity/history",
      element: <TaskHistory />,
    },

    // ==================== Settings ====================
    {
      path: "settings",
      element: <EmployeeSettings />,
    },
  ],
};

export default employeeRoutes;
