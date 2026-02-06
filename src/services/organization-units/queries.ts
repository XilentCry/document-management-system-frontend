import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getAllOrganizationUnits,
  getOrganizationUnitFolders,
  getOrganizationUnitItems,
} from "./api";

export const useGetAllOrganizationUnits = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["organization-units"],
    queryFn: getAllOrganizationUnits,
  });

  return { isLoading, isError, error, data };
};

export const useGetOrganizationUnitItems = (id: string) => {
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
    queryKey: [`organization-unit-${id}-items`],
    queryFn: ({ pageParam }) => getOrganizationUnitItems({ id, pageParam }),
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

export const useGetOrganizationUnitFolders = (
  organizationUnitId: number | null,
  folderId: number | null,
) => {
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
    queryKey: [`organization-unit-${organizationUnitId}-folders`],
    queryFn: ({ pageParam }) =>
      getOrganizationUnitFolders(organizationUnitId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage?.meta?.next_cursor,
    enabled: !!organizationUnitId && !folderId,
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
