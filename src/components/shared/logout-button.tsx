"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth/api";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const data = await logout();

      toast.success(data.message);
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
