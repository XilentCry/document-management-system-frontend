import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllAuditLogs } from "./client";

export const useGetAllAuditLogs = (page: number, searchTerm?: string) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["audit-logs", { page, search: searchTerm }],
      queryFn: () => getAllAuditLogs(page, searchTerm),
      placeholderData: keepPreviousData,
      staleTime: 0,
    });

  return {
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    isPlaceholderData
  };
};
