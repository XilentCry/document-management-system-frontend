import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getUser } from "./api";

export const useGetAllUsers = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  return { isLoading, isError, error, data };
};

export const useGetUser = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
  });

  return { isLoading, isError, error, data };
};
