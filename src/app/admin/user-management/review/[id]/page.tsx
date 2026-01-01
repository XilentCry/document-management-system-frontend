import { LogoutButton } from "@/components/logout-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function ReviewUserPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b flex items-center justify-between px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/user-management">
                User Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Review User</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LogoutButton />
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1>Review User</h1>
      </div>
    </div>
  );
}
