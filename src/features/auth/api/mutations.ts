import { clearAllStores } from "@/stores/clear-all-stores";
import { useOrganizationUnitStore } from "@/features/organization-units/store/organization-unit-store";
import type { TFormError } from "@/types/form-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { login, logout, register, resendVerificationEmail } from "./client";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setCurrentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.setCurrentOrganizationUnitId,
  );
  const setCurrentOrganizationUnitName = useOrganizationUnitStore(
    (state) => state.setCurrentOrganizationUnitName,
  );

  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(["current-user"], data.user);

      if (
        data.user.role === "user" &&
        data.user.currentOrganizationUnitId &&
        data.user.currentOrganizationUnitName
      ) {
        setCurrentOrganizationUnitId(data.user.currentOrganizationUnitId);
        setCurrentOrganizationUnitName(data.user.currentOrganizationUnitName);
        router.replace(
          `/drive/organizational-drive/${data.user.currentOrganizationUnitId}`,
        );
      } else if (data.user.role === "admin" || data.user.role === "superuser") {
        router.replace("/admin/user-management");
      }
    },
    onError: (error: Error & { code?: string }, variables) => {
      switch (error.code) {
        case "EMAIL_NOT_VERIFIED": {
          const email = encodeURIComponent(variables.email);
          router.push(`/email/verify?email=${email}`);
          break;
        }
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
    onSuccess: (data, variables) => {
      setFormErrors(null);
      toast.success(data.message);

      const email = encodeURIComponent(variables.email);
      router.push(`/email/verify?email=${email}`);
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
  return useMutation({
    mutationFn: (email: string) => resendVerificationEmail(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error & { code?: string }) => {
      toast.error(error.message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
    onSettled: () => {
      queryClient.clear();
      clearAllStores();
      router.replace("/");
    },
  });
};
