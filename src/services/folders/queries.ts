import { useQuery } from "@tanstack/react-query";
import { getFolderItems, getFolderSubfolders } from "./api";

export const useGetFolderItems = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`folder-${id}-items`],
    queryFn: () => getFolderItems(id),
  });

  return { isLoading, isError, error, data };
};

export const useGetFolderSubfolders = (id: number | null) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`folder-${id}-subfolders`],
    queryFn: () => getFolderSubfolders(id),
    enabled: !!id,
  });

  return { isLoading, isError, error, data };
};
