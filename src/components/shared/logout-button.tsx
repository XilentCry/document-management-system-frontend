"use client";

import { logout } from "@/services/auth/api";
import { clearAllStores } from "@/stores/clear-all-stores";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      const data = await logout();

      toast.success(data.message);
      queryClient.clear();
      clearAllStores();

      router.replace("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <DropdownMenuItem variant="destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
  );
}
