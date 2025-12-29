import { LogoutButton } from "@/components/admin/logout-button";
import { EditUserForm } from "@/components/admin/user-management/edit-user-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function EditUserPage() {
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
              <BreadcrumbPage>Edit User</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LogoutButton />
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1>Edit User</h1>
        <EditUserForm />
      </div>
    </div>
  );
}
