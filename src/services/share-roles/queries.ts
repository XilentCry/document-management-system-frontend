import { useQuery } from "@tanstack/react-query";
import { getAllShareRoles } from "./api";

export const useGetAllShareRoles = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["share-roles"],
    queryFn: getAllShareRoles,
  });

  return { isLoading, isError, error, data };
};
