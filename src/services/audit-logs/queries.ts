import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllAuditLogs } from "./api";

export const useGetAllAuditLogs = (page: number, searchTerm?: string) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData, isFetching } =
    useQuery({
      queryKey: ["audit-logs", page, searchTerm],
      queryFn: () => getAllAuditLogs(page, searchTerm),
      placeholderData: keepPreviousData,
    });

  return {
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    isPlaceholderData,
    isFetching,
  };
};
