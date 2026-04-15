import { TUpdateUserFormSchema } from "@/schemas/users/update-user-form-schema";
import { TFormError } from "@/types/form-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { inviteAdmin, reinviteAdmin, updateStatus, updateUser } from "./api";
import { TUserStatus } from "@/types/user-status";


export const useUpdateStatus = (
  setStatus: Dispatch<SetStateAction<TUserStatus>>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: string;
      nextStatus: TUserStatus;
    }) => updateStatus(userId, status),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      setStatus(variables.nextStatus);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateUser = (setFormErrors: Dispatch<SetStateAction<TFormError | null>>) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      userData,
      userId,
    }: {
      userData: TUpdateUserFormSchema;
      userId: string;
    }) => updateUser(userData, userId),
    onSuccess: (data, variables) => {
      setFormErrors(null);

      if ("errors" in data) {
        setFormErrors(data.errors);
        return;
      }

      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push(`/admin/user-management/view/${variables.userId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useInviteAdmin = (
  setFormErrors: Dispatch<SetStateAction<TFormError | null>>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteAdmin,
    onSuccess: (data) => {
      setFormErrors(null);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
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

export const useReinviteAdmin = () => {
  return useMutation({
    mutationFn: (id: string) => reinviteAdmin(id),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
