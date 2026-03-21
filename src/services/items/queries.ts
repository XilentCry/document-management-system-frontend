import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getItemActivities, getShareableUsers } from "./api";

export const useGetShareableUsers = (id: number, enabled: boolean = true) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["documents", id, "shareable-users"],
    queryFn: () => getShareableUsers(id),
    enabled,
    staleTime: 0,
  });

  return { isLoading, isError, error, data };
};

export const useGetItemActivities = (
  id: number | null,
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
  } = useInfiniteQuery({
    queryKey: ["item", id, "activities"],
    queryFn: ({ pageParam }) => getItemActivities({ id, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!id && isRailTabActivity,
  });

  return {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
