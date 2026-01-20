import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../services/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (role, credentials) => {
        set({ isLoading: true, error: null });
        try {
          let response;
          if (role === "admin") {
            response = await authAPI.adminLogin(credentials);
          } else if (role === "manager") {
            response = await authAPI.managerLogin(credentials);
          } else {
            response = await authAPI.employeeLogin(credentials);
          }

          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, user: response.data.user };
          }
        } catch (error) {
          const message =
            error.response?.data?.message || "Login failed. Please try again.";
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      // Register action
      register: async (role, userData) => {
        set({ isLoading: true, error: null });
        try {
          let response;
          if (role === "admin") {
            response = await authAPI.adminRegister(userData);
          } else if (role === "manager") {
            response = await authAPI.managerRegister(userData);
          } else {
            response = await authAPI.employeeRegister(userData);
          }

          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, user: response.data.user };
          }
        } catch (error) {
          const message =
            error.response?.data?.message ||
            "Registration failed. Please try again.";
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      // Logout action
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error("Logout error:", error);
        }
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Check auth status
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
