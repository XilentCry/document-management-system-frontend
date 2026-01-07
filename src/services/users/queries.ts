import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllUsers, getUser } from "./api";

export const useGetAllUsers = (page: number) => {
  const { isLoading, isError, error, data, isPlaceholderData } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getAllUsers(page),
    placeholderData: keepPreviousData,
  });

  return { isLoading, isError, error, data, isPlaceholderData };
};

export const useGetUser = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
  });

  return { isLoading, isError, error, data };
};
