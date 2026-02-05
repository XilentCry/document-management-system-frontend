"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRailStore } from "@/stores/rail-store";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetRail = useRailStore((s) => s.reset);

  const handleLogout = async () => {
    try {
      const data = await logout();

      toast.success(data.message);
      queryClient.clear();
      resetRail();
      localStorage.removeItem("folder-storage");
      localStorage.removeItem("organization-unit-storage");
      localStorage.removeItem("user-storage");
      localStorage.removeItem("rail-storage");
      router.replace("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout}>
      <LogOut />
    </Button>
  );
}
