import { ResetPassword } from "@/features/auth/components/reset-password/reset-password";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
