import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getDocumentDetails,
  getDocumentShares,
  getDocumentVersions,
  getDownloadEligibleUsers,
  getPublicDocumentDetails,
  getTrashedDocuments,
} from "./client";

export const useGetDocumentShares = (documentId: string, enabled: boolean = true) => {
  const {
    isLoading,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["documents", "detail", documentId, "shares"],
    queryFn: ({ pageParam }) => getDocumentShares({ id: documentId, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!documentId && enabled,
  });

  return {
    isLoading,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const useGetDocumentVersions = (id: string, enabled: boolean = true) => {
  const {
    isLoading,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["documents", "detail", id, "versions"],
    queryFn: ({ pageParam }) => getDocumentVersions({ id, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!id && enabled,
  });

  return {
    isLoading,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const useGetDocumentDetails = (
  id: string | null,
  isRailTabDetails: boolean,
  enabled: boolean = true,
) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["documents", "detail", id],
    queryFn: () => getDocumentDetails(id),
    enabled: !!id && isRailTabDetails && enabled,
  });

  return { isLoading, isError, error, data };
};

export const useGetPublicDocumentDetails = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["documents", "detail", id, "public"],
    queryFn: () => getPublicDocumentDetails(id),
  });

  return { isLoading, isError, error, data };
};

export const useGetDownloadEligibleUsers = (
  documentId: string,
  q: string,
  enabled: boolean = true,
  filter?: "granted" | "not_granted",
) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["documents", "detail", documentId, "download-eligible", { filter: filter ?? "all", search: q }],
    queryFn: ({ pageParam }) =>
      getDownloadEligibleUsers({ id: documentId, q, pageParam, filter }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!documentId && enabled,
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const useGetTrashedDocuments = () => {
  const {
    isLoading,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["documents", "trash"],
    queryFn: ({ pageParam }) => getTrashedDocuments({ pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
  });

  return {
    isLoading,
    isError,
    error,
    isFetchNextPageError,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
