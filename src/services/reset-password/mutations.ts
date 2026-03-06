import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { forgotPassword, resetPassword } from "./api";

export const useForgotPassword = (
  setFormError: Dispatch<SetStateAction<string>>,
) => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      setFormError("");
      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof Error) {
        setFormError(error.message);
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

