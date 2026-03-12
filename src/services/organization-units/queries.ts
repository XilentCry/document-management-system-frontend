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
} from "./api";
import { TFilterOwner } from "@/types/filter-owner";

export const useGetSpecificUsers = (id: number | null) => {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: specificUsers,
  } = useQuery({
    queryKey: ["organization-unit", Number(id), "specific-users"],
    queryFn: () => getSpecificUsers(id),
    enabled: !!id,
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
  });

  return { isLoading, isError, error, data };
};

export const useGetAllOrganizationUnitsFlat = (page: number) => {
  const { isLoading, isError, error, isSuccess, data, isPlaceholderData } =
    useQuery({
      queryKey: ["organization-units", page],
      queryFn: () => getAllOrganizationUnitsFlat(page),
      placeholderData: keepPreviousData,
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
