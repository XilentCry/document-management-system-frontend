import { RegisterForm } from "@/components/user/auth/register-form";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh justify-center py-4">
      <div className="w-full max-w-3xl space-y-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/logo.png" alt="NORSU" width={80} height={80} />
          <span className="text-2xl font-bold">
            NORSU Document Management System
          </span>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
