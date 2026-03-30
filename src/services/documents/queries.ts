import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getDocumentDetails,
  getDocumentVersions,
  getPublicDocumentDetails,
} from "./api";

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
    queryKey: ["document", id, "versions"],
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
    queryKey: ["document", id, "details"],
    queryFn: () => getDocumentDetails(id),
    enabled: !!id && isRailTabDetails && enabled,
  });

  return { isLoading, isError, error, data };
};

export const useGetPublicDocumentDetails = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["document", id, "details", "public"],
    queryFn: () => getPublicDocumentDetails(id),
  });

  return { isLoading, isError, error, data };
};
