import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "./api";
import { toast } from "sonner";

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, statusId }: { userId: number; statusId: number }) =>
      updateStatus(userId, statusId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
