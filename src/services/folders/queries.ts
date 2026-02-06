import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getFolderDetails, getFolderItems, getFolderSubfolders } from "./api";

export const useGetFolderItems = (id: string) => {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [`folder-${id}-items`],
    queryFn: ({ pageParam }) => getFolderItems({ id, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
  });

  return {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};

export const useGetFolderSubfolders = (id: number | null) => {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [`folder-${id}-subfolders`],
    queryFn: ({ pageParam }) => getFolderSubfolders(id, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage?.meta?.next_cursor,
    enabled: !!id,
  });

  return {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};

export const useGetFolderDetails = (
  id: number | null,
  isRailTabDetails: boolean,
) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`folder-${id}-details`],
    queryFn: () => getFolderDetails(id),
    enabled: !!id && isRailTabDetails,
  });

  return { isLoading, isError, error, data };
};
