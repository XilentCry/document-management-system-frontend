import { AdminSidebar } from "@/layouts/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      {children}
    </SidebarProvider>
  );
}
