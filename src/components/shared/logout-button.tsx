"use client";

import { useLogout } from "@/services/auth/mutations";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";

export function LogoutButton() {
  const { mutate: logoutMutation, isPending } = useLogout();

  return (
    <DropdownMenuItem variant="destructive" onClick={() => logoutMutation()} disabled={isPending}>
      {isPending ? <><Spinner />Logging out...</> : "Log out"}
    </DropdownMenuItem>
  );
}
