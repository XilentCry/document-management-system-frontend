import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "./api";

export const useGetAllUsers = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  return { isLoading, isError, error, data };
};
