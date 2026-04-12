import { Header } from "@/components/user/auth/header";
import { RegisterForm } from "@/components/user/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl space-y-7 py-4">
          <h1 className="text-xl font-semibold text-center">Create an account.</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
