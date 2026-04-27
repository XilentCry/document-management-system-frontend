import { UserList } from "@/features/users/components/user-list";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { AvatarDropdown } from "@/components/shared/avatar-dropdown";

export default function UserManagementPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-end px-4">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <AvatarDropdown />
        </div>
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1 className="text-xl">User Management</h1>
        <UserList />
      </div>
    </div>
  );
}
