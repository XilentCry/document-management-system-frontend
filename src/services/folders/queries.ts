import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFolderDetails, getFolderItems, getFolderSubfolders } from "./api";

export const useGetFolderItems = (id: string) => {
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
    queryKey: ["folder", Number(id), "items"],
    queryFn: ({ pageParam }) => getFolderItems({ id, pageParam }),
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

export const useGetFolderSubfolders = (id: number | null, enabled: boolean = true) => {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["folder", id, "subfolders"],
    queryFn: ({ pageParam }) => getFolderSubfolders({ id, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!id && enabled,
  });

  return {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const useGetFolderDetails = (
  id: number | null,
  isRailTabDetails: boolean,
  enabled: boolean = true,
) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["folder", id, "details"],
    queryFn: () => getFolderDetails(id),
    enabled: !!id && isRailTabDetails && enabled,
  });

  return { isLoading, isError, error, data };
};
