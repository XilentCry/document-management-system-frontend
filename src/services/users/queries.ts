import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllUsers, getUser } from "./api";

export const useGetAllUsers = (page: number, searchTerm?: string) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData, isFetching } =
    useQuery({
      queryKey: ["users", page, searchTerm],
      queryFn: () => getAllUsers(page, searchTerm),
      placeholderData: keepPreviousData,
    });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    data,
    isSuccess,
    isPlaceholderData,
  };
};

export const useGetUser = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
  });

  return { isLoading, isError, error, data };
};
