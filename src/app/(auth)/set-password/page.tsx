import { SetPassword } from "@/features/auth/components/set-password/set-password";
import { Suspense } from "react";

export default function SetPasswordPage() {
  return (
    <Suspense>
      <SetPassword />
    </Suspense>
  );
}
