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
  getSpecificUsers,
  searchOrganizationUnitItems,
  searchTopOrganizationUnitItems,
} from "./api";
import { TFilterOwner } from "@/types/filter-owner";

export const useGetSpecificUsers = (id: number | null, enabled: boolean = true) => {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: specificUsers,
  } = useQuery({
    queryKey: ["organization-unit", Number(id), "specific-users"],
    queryFn: () => getSpecificUsers(id),
    enabled: !!id && enabled,
  });

  return {
    isLoading,
    isError,
    error,
    isSuccess,
    specificUsers,
  };
};

export const useSearchOrganizationUnitItems = (
  id: number | null,
  searchTerm: string | null,
  filterType: TFilterType | null,
  filterClassification: number | null,
  filterOwner: TFilterOwner,
  filterOwnerId: number | null,
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
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    enabled: !!id && !!searchTerm,
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
  const { isLoading, isFetching, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["organization-units", page, searchTerm],
      queryFn: () => getAllOrganizationUnitsFlat(page, searchTerm),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  return { isLoading, isFetching, isError, error, isSuccess, data, isPlaceholderData };
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
    queryKey: ["organization-unit", Number(id), "items"],
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
  organizationUnitId: number | null,
  folderId: number | null,
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
  id: number | null,
  searchTerm: string | null,
  filterType: TFilterType | null,
  filterClassification: number | null,
  filterOwner: TFilterOwner | null,
  filterOwnerId: number | null,
) => {
  const { isLoading, isError, error, isSuccess, data, isFetching } = useQuery({
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
    ],
    queryFn: () =>
      searchTopOrganizationUnitItems({
        id,
        searchTerm,
        filterType,
        filterClassification,
        filterOwner,
        filterOwnerId,
      }),
    enabled: !!id && !!searchTerm,
    staleTime: 0,
  });

  return { isLoading, isError, error, isSuccess, data, isFetching };
};
