"use client";

import { EmailVerificationStatus } from "@/components/user/email-status";
import { useResendVerificationEmail } from "@/services/auth/mutations";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const { mutateAsync: resendVerificationEmailMutation, isPending } =
    useResendVerificationEmail();

  const handleResend = async () => {
    await resendVerificationEmailMutation();
  };

  return (
    <div className="h-svh flex flex-col items-center justify-center py-24 sm:px-4 max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src="/logo.png" alt="NORSU" width={80} height={80} />
        <span className="text-2xl font-bold">
          NORSU Document Management System
        </span>
      </div>
      {status === "verification_successful" ? (
        <EmailVerificationStatus
          title="Email verified successfully"
          description="Your email address has been successfully verified. You may now sign in."
          href="/"
        />
      ) : status === "already_verified" ? (
        <EmailVerificationStatus
          title="Email already verified"
          description="Your email address has already been verified. You can proceed to login."
          href="/"
        />
      ) : (
        <EmailVerificationStatus
          title="Verify your email"
          description="We've sent a verification link to your email address. Please check your inbox and click the link to continue."
          onClick={handleResend}
          isPending={isPending}
        />
      )}
    </div>
  );
}
