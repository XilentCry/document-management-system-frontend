import { useQuery } from "@tanstack/react-query";
import { getAllClassifications } from "./client";

export const useGetAllClassifications = (enabled: boolean = true) => {
  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["classifications"],
    queryFn: getAllClassifications,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { isLoading, isError, isSuccess, error, data };
};
