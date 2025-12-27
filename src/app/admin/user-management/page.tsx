import Header from "@/components/admin/layout/header";
import { UserList } from "@/components/admin/user-management/user-list";

export default function UserManagement() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Management" />
      <div className="p-4 flex-1 flex flex-col gap-4">
        <UserList />
      </div>
    </div>
  );
}
