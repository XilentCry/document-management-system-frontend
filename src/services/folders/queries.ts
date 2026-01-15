import { useQuery } from "@tanstack/react-query";
import { getFolderItems } from "./api";

export const useGetFolderItems = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`folder-${id}-items`],
    queryFn: () => getFolderItems(id),
  });

  return { isLoading, isError, error, data };
};
