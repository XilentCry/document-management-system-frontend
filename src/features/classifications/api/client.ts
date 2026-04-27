import apiClient from "@/lib/api-client";
import { TClassification } from "@/features/classifications/types/classification";

export async function getAllClassifications(): Promise<TClassification[]> {
  const { data } = await apiClient.get("/api/classifications");
  return data.classifications;
}
