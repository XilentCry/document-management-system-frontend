"use client";

import { SetPasswordForm } from "@/components/user/set-password/set-password-form";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export function SetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const decodedEmail = email ? decodeURIComponent(email) : undefined;

  return (
    <div className="flex min-h-svh justify-center py-24">
      <div className="w-full max-w-sm space-y-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="NORSU" width={80} height={80} />
          <span className="text-2xl font-bold">
            NORSU Document Management System
          </span>
        </div>
        {token && decodedEmail && (
          <SetPasswordForm token={token} email={decodedEmail} />
        )}
      </div>
    </div>
  );
}
