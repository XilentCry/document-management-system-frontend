import { VerifyEmail } from "@/features/auth/components/verify-email";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
