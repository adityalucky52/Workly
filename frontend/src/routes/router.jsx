import { createBrowserRouter } from "react-router-dom";

// Route configurations
import { authRoutes } from "./authRoutes";
import { adminRoutes } from "./adminRoutes";
import { managerRoutes } from "./managerRoutes";
import { employeeRoutes } from "./employeeRoutes";

// Common pages
import NotFound from "../pages/common/NotFound";

/**
 * Main Router Configuration
 * Combines all route modules into a single router
 *
 * Structure:
 * - authRoutes: /login, /register, / (redirect)
 * - adminRoutes: /admin/*
 * - managerRoutes: /manager/*
 * - employeeRoutes: /employee/*
 * - 404: catch-all
 */
export const router = createBrowserRouter([
  // Auth Routes (public)
  ...authRoutes,

  // Protected Routes (role-based)
  adminRoutes,
  managerRoutes,
  employeeRoutes,

  // 404 Catch-all
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
