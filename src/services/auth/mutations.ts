import type { TFormError } from "@/types/form-error";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { login, register, resendVerificationEmail } from "./api";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";

export const useLogin = () => {
  const setCurrentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.setCurrentOrganizationUnitId
  );

  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.user.role === "User" && data.organizationUnitId) {
        setCurrentOrganizationUnitId(data.organizationUnitId);
        router.replace(`/drive/department-drive/${data.organizationUnitId}`);
      } else if (data.user.role === "Admin") {
        router.replace("/admin/user-management");
      }
    },
    onError: (error: Error & { code?: string }) => {
      switch (error.code) {
        case "EMAIL_NOT_VERIFIED":
          router.push("/email/verify");
          break;
        case "ACCOUNT_PENDING":
          toast.error(error.message);
          break;
        default:
          toast.error(error.message);
      }
    },
  });
};

export const useRegister = (
  setFormErrors: Dispatch<SetStateAction<TFormError | null>>
) => {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setFormErrors(null);

      toast.success(data.message);
      router.push("/email/verify");
    },
    onError: (error: { errors: TFormError } | Error) => {
      if ("errors" in error) {
        setFormErrors(error.errors);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });
};

export const useResendVerificationEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error & { code?: string }) => {
      switch (error.code) {
        case "EMAIL_ALREADY_VERIFIED":
          router.replace("/email/verify?status=already_verified");
          break;
        default:
          toast.error(error.message);
      }
    },
  });
};
