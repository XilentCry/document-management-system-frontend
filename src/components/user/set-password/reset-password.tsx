"use client";

import { ResetPasswordForm } from "@/components/user/reset-password/reset-password-form";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const decodedEmail = email ? decodeURIComponent(email) : undefined;

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="NORSU" width={80} height={80} />
          <span className="text-2xl font-bold">
            NORSU Document Management System
          </span>
        </div>
        {token && decodedEmail && (
          <ResetPasswordForm token={token} email={decodedEmail} />
        )}
      </div>
    </div>
  );
}
