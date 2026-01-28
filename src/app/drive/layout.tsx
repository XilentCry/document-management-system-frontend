import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/user/layout/header";
import { UserSidebar } from "@/components/user/layout/user-sidebar";
import { Rail } from "@/components/user/shared/rail";
import { UploadProgress } from "@/components/user/shared/upload-progress";

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
        <div className="flex-1 flex">
          {children}
          <Rail />
        </div>
        <UploadProgress />
      </div>
    </SidebarProvider>
  );
}
