import { Navigate } from "react-router-dom";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/**
 * Auth Routes Configuration
 * Public routes for authentication
 */
export const authRoutes = [
  // Login
  {
    path: "/login",
    element: <Login />,
  },
  // Register
  {
    path: "/register",
    element: <Register />,
  },
  // Root redirect to login
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
];

export default authRoutes;
