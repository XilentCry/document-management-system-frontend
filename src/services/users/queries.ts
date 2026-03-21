import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllUsers, getUser, getRoles, getStatuses, getUserAuditLogs } from "./api";

export const useGetAllUsers = (
  page: number,
  searchTerm?: string,
  roles?: string[],
  statuses?: string[]
) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData, isFetching } =
    useQuery({
      queryKey: ["users", page, searchTerm, roles, statuses],
      queryFn: () => getAllUsers(page, searchTerm, roles, statuses),
      placeholderData: keepPreviousData,
      staleTime: 0,
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

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    staleTime: 60 * 1000 * 5, // 5 minutes
  });
};

export const useGetStatuses = () => {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    staleTime: 60 * 1000 * 5, // 5 minutes
  });
};

export const useGetUserAuditLogs = (userId: number | string, page: number) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["user-audit-logs", userId, page],
      queryFn: () => getUserAuditLogs(userId, page),
      placeholderData: keepPreviousData,
      staleTime: 0,
    });

  return {
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    isPlaceholderData,
  };
};
