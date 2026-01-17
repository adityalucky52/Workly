import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/ui/theme-provider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="light" storageKey="admin-theme">
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);
