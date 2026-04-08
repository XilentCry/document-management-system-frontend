"use client";

import { ResetPasswordForm } from "@/components/user/reset-password/reset-password-form";
import { useSearchParams } from "next/navigation";
import { Header } from "../auth/header";

export function ResetPassword() {
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
            <ResetPasswordForm token={token} email={decodedEmail} />
          )}
        </div>
      </div>
    </div>
  );
}
