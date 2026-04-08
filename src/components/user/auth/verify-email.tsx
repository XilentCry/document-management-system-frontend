"use client";

import { EmailVerificationStatus } from "@/components/user/auth/email-verification-status";
import { useResendVerificationEmail } from "@/services/auth/mutations";
import { useSearchParams } from "next/navigation";
import { Header } from "./header";

export function VerifyEmail() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const { mutateAsync: resendVerificationEmailMutation, isPending } =
    useResendVerificationEmail();

  const handleResend = async () => {
    await resendVerificationEmailMutation();
  };

  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <div className="flex-1 flex items-center justify-center">
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
    </div>
  );
}
