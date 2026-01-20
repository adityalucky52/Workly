import { Routes, Route, Navigate } from "react-router-dom";

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes - Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Users */}
        <Route path="users" element={<AllUsers />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users/:id/assign-manager" element={<AssignManager />} />

        {/* Managers */}
        <Route path="managers" element={<ManagerList />} />
        <Route path="managers/:id" element={<ManagerDetails />} />

        {/* Employees */}
        <Route path="employees" element={<AdminEmployeeList />} />
        <Route path="employees/:id" element={<AdminEmployeeDetails />} />
        <Route path="employees/:id/transfer" element={<TransferEmployee />} />

        {/* Tasks */}
        <Route path="tasks" element={<AllTasks />} />
        <Route path="tasks/:id" element={<AdminTaskDetails />} />

        {/* Reports */}
        <Route path="reports/overview" element={<SystemOverview />} />
        <Route path="reports/workload" element={<WorkloadReport />} />

        {/* Settings */}
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Manager Routes - Protected */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="dashboard" element={<ManagerDashboard />} />

        {/* Team */}
        <Route path="team" element={<TeamOverview />} />
        <Route path="team/:id" element={<EmployeeProfile />} />
        <Route path="team/workload" element={<WorkloadView />} />

        {/* Tasks */}
        <Route path="tasks" element={<ManagerMyTasks />} />
        <Route path="tasks/create" element={<ManagerCreateTask />} />
        <Route path="tasks/assigned" element={<AssignedTasks />} />
        <Route path="tasks/:id" element={<ManagerTaskDetails />} />

        {/* Reports */}
        <Route path="reports/performance" element={<TeamPerformance />} />
        <Route path="reports/completion" element={<TaskCompletion />} />

        {/* Settings */}
        <Route path="settings" element={<ManagerSettings />} />
      </Route>

      {/* Employee Routes - Protected */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />

        {/* Tasks */}
        <Route path="tasks" element={<EmployeeMyTasks />} />
        <Route path="tasks/:id" element={<EmployeeTaskDetails />} />
        <Route path="tasks/update" element={<UpdateStatus />} />

        {/* Activity */}
        <Route path="activity/history" element={<TaskHistory />} />
        <Route path="activity/comments" element={<Comments />} />

        {/* Settings */}
        <Route path="settings" element={<EmployeeSettings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
