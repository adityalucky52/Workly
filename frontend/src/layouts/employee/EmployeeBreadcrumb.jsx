import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Fragment } from "react";

const routeLabels = {
  employee: "Employee",
  dashboard: "Dashboard",
  tasks: "Tasks",
  update: "Update Status",
  activity: "Activity",
  history: "Task History",
  comments: "Comments",
  settings: "Settings",
};

const EmployeeBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length <= 2 && pathnames.includes("dashboard")) {
    return null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/employee/dashboard" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathnames.map((path, index) => {
          if (path === "employee") return null;

          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const label =
            routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);

          const isId = /^[0-9a-fA-F-]{36}$/.test(path) || /^\d+$/.test(path);
          const displayLabel = isId ? "Details" : label;

          return (
            <Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayLabel}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={routeTo}>{displayLabel}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default EmployeeBreadcrumb;
