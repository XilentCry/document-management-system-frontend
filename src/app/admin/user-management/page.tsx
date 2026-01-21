import { UserList } from "@/components/admin/user-management/user-list";
import { LogoutButton } from "@/components/shared/logout-button";

export default function UserManagementPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-end px-4">
        <LogoutButton />
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1 className="text-2xl">User Management</h1>
        <UserList />
      </div>
    </div>
  );
}
