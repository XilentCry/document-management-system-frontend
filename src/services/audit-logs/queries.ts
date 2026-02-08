import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllAuditLogs } from "./api";

export const useGetAllAuditLogs = (page: number) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["audit-logs", page],
      queryFn: () => getAllAuditLogs(page),
      placeholderData: keepPreviousData,
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
