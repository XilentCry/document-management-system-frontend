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
  searchOrganizationUnitItems,
} from "./api";

export const useSearchOrganizationUnitItems = (
  id: number | null,
  searchTerm: string | null,
  filterType: TFilterType | null,
  filterClassification: number | null,
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
