import { useQuery } from "@tanstack/react-query";
import { getAllShareRoles } from "./api";

export const useGetAllShareRoles = (enabled: boolean = true) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["share-roles"],
    queryFn: getAllShareRoles,
    enabled,
  });

  return { isLoading, isError, error, data };
};
