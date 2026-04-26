import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getAllSharedWithMe,
  fetchCurrentUser,
  getUserOrganizationUnits,
  getMySignings,
  getMySubmissions,
  getSubmissionDetails,
} from "./api";

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

export const useGetMySignings = (status?: string) => {
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
    queryKey: ["user", "signings", { status }],
    queryFn: ({ pageParam }) => getMySignings({ status, after: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.next || undefined;
    },
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

export const useGetMySubmissions = (status?: string) => {
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
    queryKey: ["user", "submissions", { status }],
    queryFn: ({ pageParam }) => getMySubmissions({ status, after: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.next || undefined;
    },
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

export const useGetSubmissionDetails = (
  submissionId: number | null,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["user", "submissions", submissionId],
    queryFn: () => getSubmissionDetails(submissionId as number),
    enabled: enabled && submissionId !== null,
  });
};
