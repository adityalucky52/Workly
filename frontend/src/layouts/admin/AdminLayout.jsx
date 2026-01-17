import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminBreadcrumb from "./AdminBreadcrumb";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AdminBreadcrumb />
          <main className="min-h-[calc(100vh-12rem)]">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
