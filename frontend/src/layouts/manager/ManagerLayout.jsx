import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import ManagerSidebar from "./ManagerSidebar";
import ManagerHeader from "./ManagerHeader";
import ManagerBreadcrumb from "./ManagerBreadcrumb";

const ManagerLayout = () => {
  return (
    <SidebarProvider>
      <ManagerSidebar />
      <SidebarInset>
        <ManagerHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ManagerBreadcrumb />
          <main className="min-h-[calc(100vh-12rem)]">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ManagerLayout;
