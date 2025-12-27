"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth/api";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout}>
      <LogOut />
    </Button>
  );
}
