import { useInfiniteQuery } from "@tanstack/react-query";
import { getItemActivities } from "./api";

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
