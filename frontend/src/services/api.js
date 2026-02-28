import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response;

      // Don't redirect to login if the failing request is already the auth check
      const isAuthCheck = config.url?.includes("/auth/me");

      if (status === 401 && !isAuthCheck) {
        // Clear auth state and redirect to login
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }

      if (status === 403) {
        console.error("Access denied");
      }
    }

    return Promise.reject(error);
  },
);

// ==================== AUTH API ====================
export const authAPI = {
  // Admin
  adminRegister: (data) => api.post("/auth/admin/register", data),
  adminLogin: (data) => api.post("/auth/admin/login", data),

  // Manager
  managerRegister: (data) => api.post("/auth/manager/register", data),
  managerLogin: (data) => api.post("/auth/manager/login", data),

  // Employee
  employeeRegister: (data) => api.post("/auth/employee/register", data),
  employeeLogin: (data) => api.post("/auth/employee/login", data),

  // Common
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard"),

  // Users
  getAllUsers: (params) => api.get("/admin/users", { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post("/admin/users", data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  assignManager: (userId, managerId) =>
    api.put(`/admin/users/${userId}/assign-manager`, { managerId }),

  // Managers
  getAllManagers: (params) => api.get("/admin/managers", { params }),
  getManagerById: (id) => api.get(`/admin/managers/${id}`),
  updateManager: (id, data) => api.put(`/admin/managers/${id}`, data),
  approveManager: (id) => api.put(`/admin/managers/${id}/approve`),
  rejectManager: (id) => api.put(`/admin/managers/${id}/reject`),

  // Employees
  getAllEmployees: (params) => api.get("/admin/employees", { params }),
  getEmployeeById: (id) => api.get(`/admin/employees/${id}`),
  approveEmployee: (id) => api.put(`/admin/employees/${id}/approve`),
  rejectEmployee: (id) => api.put(`/admin/employees/${id}/reject`),
  transferEmployee: (id, newManagerId) =>
    api.put(`/admin/employees/${id}/transfer`, { newManagerId }),

  // Tasks
  createTask: (data) => api.post("/admin/tasks", data),
  getAllTasks: (params) => api.get("/admin/tasks", { params }),
  getTaskById: (id) => api.get(`/admin/tasks/${id}`),

  // Reports
  getSystemOverview: () => api.get("/admin/reports/overview"),
  getWorkloadReport: () => api.get("/admin/reports/workload"),
};

// ==================== MANAGER API ====================
export const managerAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/manager/dashboard"),

  // Team
  getTeamMembers: (params) => api.get("/manager/team", { params }),
  getTeamMemberById: (id) => api.get(`/manager/team/${id}`),
  getTeamWorkload: () => api.get("/manager/team/workload"),

  // Tasks
  createTask: (data) => api.post("/manager/tasks", data),
  getMyTasks: (params) => api.get("/manager/tasks", { params }),
  getAssignedTasks: (params) => api.get("/manager/tasks/assigned", { params }),
  getTaskById: (id) => api.get(`/manager/tasks/${id}`),
  updateTask: (id, data) => api.put(`/manager/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/manager/tasks/${id}`),

  // Reports
  getTeamPerformance: () => api.get("/manager/reports/performance"),
  getTaskCompletion: () => api.get("/manager/reports/completion"),
};

// ==================== EMPLOYEE API ====================
export const employeeAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/employee/dashboard"),

  // Tasks
  getMyTasks: (params) => api.get("/employee/tasks", { params }),
  getTaskById: (id) => api.get(`/employee/tasks/${id}`),
  updateTaskStatus: (id, data) => api.put(`/employee/tasks/${id}/status`, data),
  getTaskComments: (id) => api.get(`/employee/tasks/${id}/comments`),
  addComment: (id, content) =>
    api.post(`/employee/tasks/${id}/comments`, { content }),

  // Activity
  getTaskHistory: (params) => api.get("/employee/activity/history", { params }),
  getMyComments: (params) => api.get("/employee/activity/comments", { params }),
};

// ==================== PROFILE API ====================
export const profileAPI = {
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile", data),
  changePassword: (data) => api.put("/profile/password", data),
  getSettings: () => api.get("/profile/settings"),
  updateSettings: (data) => api.put("/profile/settings", data),
};

// ==================== GROUP API ====================
export const groupAPI = {
  createGroup: (data) => api.post("/groups", data),
  getAllGroups: (params) => api.get("/groups", { params }),
  getGroupById: (id) => api.get(`/groups/${id}`),
  updateGroup: (id, data) => api.put(`/groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/groups/${id}`),
  getAvailableMembers: () => api.get("/groups/available-members"),
};

export default api;
