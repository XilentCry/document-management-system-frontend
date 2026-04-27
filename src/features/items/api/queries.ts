import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getItemActivities, getShareableUsers } from "./client";

export const useGetShareableUsers = (
  id: string,
  searchTerm: string,
  enabled: boolean = true,
) => {
  const { isLoading, isFetching, isError, error, data } = useQuery({
    queryKey: ["items", "detail", id, "shareable-users", { search: searchTerm }],
    queryFn: () => getShareableUsers(id, searchTerm),
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 0,
  });

  return { isLoading, isFetching, isError, error, data };
};

export const useGetItemActivities = (
  id: string | null,
  isRailTabActivity: boolean,
) => {
  const {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ["items", "detail", id, "activities"],
    queryFn: ({ pageParam }) => getItemActivities({ id, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!id && isRailTabActivity,
  });

  return {
    isLoading,
    isError,
    error,
    isFetchNextPageError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
