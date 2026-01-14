import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/user/layout/header";
import { UserSidebar } from "@/components/user/layout/user-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </SidebarProvider>
  );
}
