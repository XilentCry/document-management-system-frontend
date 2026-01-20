import { VerifyEmail } from "@/components/user/auth/verify-email";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verify email...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
