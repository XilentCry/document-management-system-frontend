import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user/layout/user-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
