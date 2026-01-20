import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes/router";
import { ThemeProvider } from "./components/ui/theme-provider";

createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="light" storageKey="admin-theme">
    <RouterProvider router={router} />
  </ThemeProvider>,
);
