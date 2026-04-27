import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBuilderToken, createSubmission } from "./client";
import { toast } from "sonner";
import { TNewSubmissionFormSchema } from "@/features/submissions/schemas/new-submission-form-schema";
import { TFormError } from "@/types/form-error";
import { Dispatch, SetStateAction } from "react";

export const useGetBuilderToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => getBuilderToken(documentId),
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({
        queryKey: ["items", "detail", documentId, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
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
    onSuccess: (_data, variables) => {
      setFormErrors(null);
      queryClient.invalidateQueries({ queryKey: ["user", "submissions"] });
      queryClient.invalidateQueries({
        queryKey: ["items", "detail", variables.document_id, "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
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
