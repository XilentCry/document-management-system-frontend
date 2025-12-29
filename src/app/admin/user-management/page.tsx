import { LogoutButton } from "@/components/admin/logout-button";
import { UserList } from "@/components/admin/user-management/user-list";

export default function UserManagementPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b flex items-center justify-end px-4">
        <LogoutButton />
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1>User Management</h1>
        <UserList />
      </div>
    </div>
  );
}
