import { useQuery } from "@tanstack/react-query";
import { getAllClassifications } from "./api";

export const useGetAllClassifications = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["classifications"],
    queryFn: getAllClassifications,
  });

  return { isLoading, isError, error, data };
};
