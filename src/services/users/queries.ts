import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getUser } from "./api";

export const useGetAllUsers = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  return { isLoading, isError, error, data };
};

export const useGetUser = (id: number) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  return { isLoading, isError, error, data };
};
