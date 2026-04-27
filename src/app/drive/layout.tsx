import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/layouts/app-header";
import { UserSidebar } from "@/layouts/user-sidebar";
import { Rail } from "@/features/drive/components/rail";
import { UploadProgress } from "@/features/uploads/components/upload-progress";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense>
          <Header />
        </Suspense>
        <div className="flex-1 flex min-w-0">
          {children}
          <Rail />
        </div>
        <UploadProgress />
      </div>
    </SidebarProvider>
  );
}
