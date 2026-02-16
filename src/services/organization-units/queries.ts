import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getAllOrganizationUnits,
  getOrganizationUnitFolders,
  getOrganizationUnitItems,
  searchOrganizationUnitItems,
} from "./api";
import { TFilterType } from "@/types/filter-type";

export const useSearchOrganizationUnitItems = (
  id: number | null,
  searchTerm: string | null,
  filterType: TFilterType,
  filterClassification: number | null,
) => {
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
    queryKey: [
      "search-organization-unit-items",
      id,
      searchTerm,
      filterType,
      filterClassification,
    ],
    queryFn: ({ pageParam }) =>
      searchOrganizationUnitItems({
        id,
        pageParam,
        searchTerm,
        filterType,
        filterClassification,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!id && !!searchTerm,
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
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [`organization-unit-${organizationUnitId}-folders`],
    queryFn: ({ pageParam }) =>
      getOrganizationUnitFolders({ id: organizationUnitId, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
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
    isFetchingNextPage,
  };
};
