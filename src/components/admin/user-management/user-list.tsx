"use client";

import { useGetAllUsers } from "@/services/users/queries";
import { Spinner } from "../../ui/spinner";
import { UserTable } from "./user-table";

export function UserList() {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: users = [],
  } = useGetAllUsers();

  if (isError && error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="text-primary size-9" />
      </div>
    );
  }

  return isSuccess && <UserTable users={users} />;
}
