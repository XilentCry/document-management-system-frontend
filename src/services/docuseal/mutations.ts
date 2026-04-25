import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBuilderToken, createSubmission } from "./api";
import { toast } from "sonner";
import { TNewSubmissionFormSchema } from "@/schemas/docuseal/new-submission-form-schema";
import { TFormError } from "@/types/form-error";
import { Dispatch, SetStateAction } from "react";

export const useGetBuilderToken = () => {
  return useMutation({
    mutationFn: (documentId: string) => getBuilderToken(documentId),
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useCreateSubmission = (
  setFormErrors: Dispatch<SetStateAction<TFormError | null>>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TNewSubmissionFormSchema) => createSubmission(data),
    onSuccess: () => {
      setFormErrors(null);
      queryClient.invalidateQueries({ queryKey: ["user", "submissions"] });
      toast.success("Submission created successfully.");
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
