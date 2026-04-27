"use client";

import { SetPasswordForm } from "@/features/auth/components/set-password/set-password-form";
import { useSearchParams } from "next/navigation";
import { Header } from "@/features/auth/components/header";

export function SetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const decodedEmail = email ? decodeURIComponent(email) : undefined;

  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          {token && decodedEmail && (
            <SetPasswordForm token={token} email={decodedEmail} />
          )}
        </div>
      </div>
    </div>
  );
}
