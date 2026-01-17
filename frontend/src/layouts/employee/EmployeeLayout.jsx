import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeBreadcrumb from "./EmployeeBreadcrumb";

const EmployeeLayout = () => {
  return (
    <SidebarProvider>
      <EmployeeSidebar />
      <SidebarInset>
        <EmployeeHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <EmployeeBreadcrumb />
          <main className="min-h-[calc(100vh-12rem)]">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default EmployeeLayout;
