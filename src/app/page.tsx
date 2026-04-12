import { Header } from "@/components/user/auth/header";
import { LoginForm } from "@/components/user/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm space-y-7">
          <h1 className="text-xl font-semibold text-center">Welcome back!</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
