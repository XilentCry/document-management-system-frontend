import { Header } from "@/features/auth/components/header";
import { ForgotPasswordForm } from "@/features/auth/components/reset-password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
