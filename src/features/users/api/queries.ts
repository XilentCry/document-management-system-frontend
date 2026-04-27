import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllUsers, getUser, getRoles, getUserAuditLogs, searchSharedToUsers } from "./client";

export const useGetAllUsers = (
  page: number,
  searchTerm?: string,
  roles?: string[],
  statuses?: string[]
) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["users", { page, search: searchTerm, roles, statuses }],
      queryFn: () => getAllUsers(page, searchTerm, roles, statuses),
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

export const useGetUser = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["users", "detail", id],
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

export const useGetUserAuditLogs = (userId: string | string, page: number) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["users", "detail", userId, "audit-logs", { page }],
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

export const useSearchSharedToUsers = (
  searchTerm: string,
  enabled: boolean = true,
) => {
  const { isLoading, isFetching, isError, error, isSuccess, data } = useQuery({
    queryKey: ["users", "shared-to", { search: searchTerm }],
    queryFn: () => searchSharedToUsers(searchTerm),
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 0,
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
    sharedToUsers: data?.sharedToUsers ?? [],
  };
};
