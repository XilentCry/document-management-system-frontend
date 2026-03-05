import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus, updateUser } from "./api";
import { toast } from "sonner";
import { TUpdateUserFormSchema } from "@/schemas/users/update-user-form-schema";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { TFormError } from "@/types/form-error";
import { UseFormReset } from "react-hook-form";
import { STATUSES } from "@/lib/constants";

export const useUpdateStatus = (
  setStatus: Dispatch<SetStateAction<"pending" | "approved">>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, statusId }: { userId: number; statusId: number }) =>
      updateStatus(userId, statusId),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      setStatus(
        variables.statusId === STATUSES.APPROVED ? "approved" : "pending",
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateUser = (
  setFormErrors: Dispatch<SetStateAction<TFormError | null>>,
  reset: UseFormReset<TUpdateUserFormSchema>,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      userData,
      userId,
    }: {
      userData: TUpdateUserFormSchema;
      userId: number;
    }) => updateUser(userData, userId),
    onSuccess: (data, variables) => {
      setFormErrors(null);

      if ("errors" in data) {
        setFormErrors(data.errors);
        return;
      }

      toast.success(data.message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push(`/admin/user-management/view/${variables.userId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
