import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgotPassword, resetPassword } from "./reset-password-client";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message);
      router.replace("/");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
};

