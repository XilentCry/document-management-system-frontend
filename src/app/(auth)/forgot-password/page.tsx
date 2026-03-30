import { ForgotPasswordForm } from "@/components/user/reset-password/forgot-password-form";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/norsu.png" alt="NORSU" width={80} height={80} />
          <span className="text-2xl font-bold">
            NORSU Document Management System
          </span>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
