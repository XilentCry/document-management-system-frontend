import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllAuditLogs } from "./api";

export const useGetAllAuditLogs = (page: number, searchTerm?: string) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["audit-logs", page, searchTerm],
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
