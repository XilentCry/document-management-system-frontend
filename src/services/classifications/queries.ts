import { useQuery } from "@tanstack/react-query";
import { getAllClassifications } from "./api";

export const useGetAllClassifications = (enabled: boolean = true) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["classifications"],
    queryFn: getAllClassifications,
    enabled,
  });

  return { isLoading, isError, error, data };
};
