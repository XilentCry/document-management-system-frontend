import { useMutation } from "@tanstack/react-query";
import { login, register, resendVerificationEmail } from "./api";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import type { TFormError } from "@/types/form-error";
import { useRouter } from "next/navigation";
import { UseFormReset } from "react-hook-form";
import { TRegisterFormSchema } from "@/schemas/auth/register-form-schema";
import { TLoginFormSchema } from "@/schemas/auth/login-form-schema";
import Cookies from "js-cookie";

export const useLogin = (reset: UseFormReset<TLoginFormSchema>) => {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      reset();

      if ("alreadyVerified" in data && data.alreadyVerified === false) {
        return router.replace("/email/verify");
      } else if ("user" in data && "organizationUnitId" in data) {
        if (data.user.role === "User") {
          Cookies.set(
            "current-organization-unit-id",
            data.organizationUnitId.toString()
          );

          router.replace(`/drive/department-drive/${data.organizationUnitId}`);
        } else if (data.user.role === "Admin") {
          router.replace("/admin/user-management");
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useRegister = (
  setFormErrors: Dispatch<SetStateAction<TFormError | null>>,
  reset: UseFormReset<TRegisterFormSchema>
) => {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setFormErrors(null);

      if ("errors" in data) {
        setFormErrors(data.errors);
        return;
      }

      toast.success(data.message);
      reset();
      router.push("/email/verify");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useResendVerificationEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (data) => {
      if ("alreadyVerified" in data && data.alreadyVerified === true) {
        return router.replace("/email/verify?status=already_verified");
      } else if ("message" in data) {
        toast.success(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
