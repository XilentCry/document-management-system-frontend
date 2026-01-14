import { useQuery } from "@tanstack/react-query";
import { getFolderContents } from "./api";

export const useGetFolderContents = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`folder-${id}-contents`],
    queryFn: () => getFolderContents(id),
  });

  return { isLoading, isError, error, data };
};
