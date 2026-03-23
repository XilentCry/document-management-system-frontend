import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createOrganizationUnit, editOrganizationUnit } from "./api";

export const useCreateOrganizationUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganizationUnit,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["organization-units"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useEditOrganizationUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editOrganizationUnit,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["organization-units"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
