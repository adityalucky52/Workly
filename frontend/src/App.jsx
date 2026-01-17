import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;
