import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllSharedWithMe, fetchCurrentUser, getUserOrganizationUnits } from "./api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: false,
  });
}

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

export const useGetUserOrganizationUnits = (enabled: boolean = true) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["user", "organization-units"],
    queryFn: getUserOrganizationUnits,
    enabled,
  });

  return { isLoading, isError, error, data };
};
