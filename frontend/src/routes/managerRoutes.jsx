import { Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Manager Layout & Pages
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

/**
 * Manager Routes Configuration
 * All routes under /manager path
 * Protected with manager role
 */
export const managerRoutes = {
  path: "/manager",
  element: (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout />
    </ProtectedRoute>
  ),
  children: [
    // Dashboard (default redirect & page)
    {
      index: true,
      element: <Navigate to="/manager/dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <ManagerDashboard />,
    },

    // ==================== Team ====================
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

    // ==================== Tasks ====================
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

    // ==================== Reports ====================
    {
      path: "reports/performance",
      element: <TeamPerformance />,
    },
    {
      path: "reports/completion",
      element: <TaskCompletion />,
    },

    // ==================== Settings ====================
    {
      path: "settings",
      element: <ManagerSettings />,
    },
  ],
};

export default managerRoutes;
