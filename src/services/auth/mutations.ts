import type { TFormError } from "@/types/form-error";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { login, register, resendVerificationEmail } from "./api";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useUserStore } from "@/stores/user-store";

export const useLogin = () => {
  const setCurrentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.setCurrentOrganizationUnitId,
  );
  const setCurrentOrganizationUnitName = useOrganizationUnitStore(
    (state) => state.setCurrentOrganizationUnitName,
  );
  const setUserId = useUserStore((state) => state.setUserId);
  const setUserRole = useUserStore((state) => state.setUserRole);
  const setLastLogin = useUserStore((state) => state.setLastLogin);
  const setLastFailedLogin = useUserStore((state) => state.setLastFailedLogin);

  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success(data.message);
      setUserId(data.user.id);
      setUserRole(data.user.role);
      setLastLogin(data.lastLogin);
      setLastFailedLogin(data.lastFailedLogin);

      if (
        data.user.role === "user" &&
        data.currentOrganizationUnitId &&
        data.currentOrganizationUnitName
      ) {
        setCurrentOrganizationUnitId(data.currentOrganizationUnitId);
        setCurrentOrganizationUnitName(data.currentOrganizationUnitName);
        router.replace(
          `/drive/organizational-drive/${data.currentOrganizationUnitId}`,
        );
      } else if (data.user.role === "admin" || data.user.role === "superuser") {
        router.replace("/admin/user-management");
      }
    },
    onError: (error: Error & { code?: string; email_sent?: boolean }) => {
      switch (error.code) {
        case "EMAIL_NOT_VERIFIED":
          if (error.email_sent === false) {
            toast.warning(error.message);
          }
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
  setFormErrors: Dispatch<SetStateAction<TFormError | null>>,
) => {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setFormErrors(null);

      if (data.email_sent === false) {
        toast.warning(data.message, { duration: 10000 });
      } else {
        toast.success(data.message);
      }

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
