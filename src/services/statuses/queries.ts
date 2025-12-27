import { useQuery } from "@tanstack/react-query";
import { getAllStatuses } from "./api";

export const useGetAllStatuses = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["statuses"],
    queryFn: getAllStatuses,
  });

  return { isLoading, isError, error, data };
};
