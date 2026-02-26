import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllSharedWithMe, getUserOrganizationUnits } from "./api";

export const useGetAllSharedWithMe = () => {
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
    queryKey: ["shared-with-me"],
    queryFn: ({ pageParam }) => getAllSharedWithMe({ pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor
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

export const useGetUserOrganizationUnits = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["user", "organization-units"],
    queryFn: getUserOrganizationUnits,
  });

  return { isLoading, isError, error, data };
};
