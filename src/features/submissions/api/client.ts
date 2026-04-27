import apiClient from "@/lib/api-client";
import { TNewSubmissionFormSchema } from "@/features/submissions/schemas/new-submission-form-schema";
import { isAxiosError } from "axios";

type TErrorResponse = {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
};

export const getBuilderToken = async (documentId: string): Promise<string> => {
  const { data } = await apiClient.post("/api/docuseal/builder-token", {
    document_id: documentId,
  });
  return data.token;
};

export const createSubmission = async (data: TNewSubmissionFormSchema) => {
  try {
    const { data: response } = await apiClient.post("/api/docuseal/submissions", data);
    return response;
  } catch (error: unknown) {
    if (isAxiosError<TErrorResponse>(error)) {
      const responseData = error.response?.data;
      if (responseData?.errors && Object.keys(responseData.errors).length > 0) {
        throw { errors: responseData.errors };
      }
      throw new Error(responseData?.message);
    }
    throw error;
  }
};
