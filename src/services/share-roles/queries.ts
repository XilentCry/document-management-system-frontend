import { useQuery } from "@tanstack/react-query";
import { getAllShareRoles } from "./api";

export const useGetAllShareRoles = (enabled: boolean = true) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["share-roles"],
    queryFn: getAllShareRoles,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { isLoading, isError, error, data };
};
