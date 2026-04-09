import { TFilterType } from "@/types/filter-type";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  getAllOrganizationUnitsFlat,
  getAllOrganizationUnitsTree,
  getOrganizationUnitFolders,
  getOrganizationUnitItems,
  searchSpecificUsers,
  searchOrganizationUnitItems,
  searchTopOrganizationUnitItems,
} from "./api";
import { TFilterOwner } from "@/types/filter-owner";

export const useSearchSpecificUsers = (
  id: string | null,
  searchTerm: string,
  enabled: boolean = true,
) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
    data: specificUsers,
  } = useQuery({
    queryKey: ["organization-unit", id, "specific-users", searchTerm],
    queryFn: () => searchSpecificUsers(id, searchTerm),
    enabled: !!id && !!searchTerm && enabled,
    staleTime: 0,
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
    specificUsers,
  };
};

export const useSearchOrganizationUnitItems = (
  id: string | null,
  searchTerm: string | null,
  filterType: TFilterType | null,
  filterClassification: string | null,
  filterOwner: TFilterOwner,
  filterOwnerId: string | null,
  filterSharedTo: string | null,
) => {
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
    queryKey: [
      "organization-unit",
      id,
      "items",
      searchTerm,
      filterType,
      filterClassification,
      filterOwner,
      filterOwnerId,
      filterSharedTo,
    ],
    queryFn: ({ pageParam }) =>
      searchOrganizationUnitItems({
        id,
        pageParam,
        searchTerm,
        filterType,
        filterClassification,
        filterOwner,
        filterOwnerId,
        filterSharedTo,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!id,
    staleTime: 0,
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

export const useGetAllOrganizationUnitsTree = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["organization-units"],
    queryFn: getAllOrganizationUnitsTree,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { isLoading, isError, error, data };
};

export const useGetAllOrganizationUnitsFlat = (page: number, searchTerm?: string) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["organization-units", page, searchTerm],
      queryFn: () => getAllOrganizationUnitsFlat(page, searchTerm),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  return { isLoading, isError, error, isSuccess, data, isPlaceholderData };
};

export const useGetOrganizationUnitItems = (id: string) => {
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
    queryKey: ["organization-unit", id, "items"],
    queryFn: ({ pageParam }) => getOrganizationUnitItems({ id, pageParam }),
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

export const useGetOrganizationUnitFolders = (
  organizationUnitId: string | null,
  folderId: string | null,
  enabled: boolean = true
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
    queryKey: ["organization-unit", organizationUnitId, "folders"],
    queryFn: ({ pageParam }) =>
      getOrganizationUnitFolders({ id: organizationUnitId, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!organizationUnitId && !folderId && enabled,
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

export const useSearchTopOrganizationUnitItems = (
  id: string | null,
  searchTerm: string | null,
  filterType: TFilterType | null,
  filterClassification: string | null,
  filterOwner: TFilterOwner | null,
  filterOwnerId: string | null,
  filterSharedTo: string | null,
) => {
  const { isLoading, isError, error, isSuccess, data } = useQuery({
    queryKey: [
      "organization-unit",
      id,
      "items",
      "search-top",
      searchTerm,
      filterType,
      filterClassification,
      filterOwner,
      filterOwnerId,
      filterSharedTo,
    ],
    queryFn: () =>
      searchTopOrganizationUnitItems({
        id,
        searchTerm,
        filterType,
        filterClassification,
        filterOwner,
        filterOwnerId,
        filterSharedTo,
      }),
    enabled: !!id && !!searchTerm,
    staleTime: 0,
  });

  return { isLoading, isError, error, isSuccess, data };
};
