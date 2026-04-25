import { useQuery } from "@tanstack/react-query";
import { getAllShareRoles } from "./api";

export const useGetAllShareRoles = (enabled: boolean = true) => {
  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["share-roles"],
    queryFn: getAllShareRoles,
    enabled,
    staleTime: Infinity,
  });

  return { isLoading, isError, isSuccess, error, data };
};
