import { useQuery } from "@tanstack/react-query";
import { getDocumentDetails } from "./api";

export const useGetDocumentDetails = (id: number | null) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`document-${id}-details`],
    queryFn: () => getDocumentDetails(id),
    enabled: !!id,
  });

  return { isLoading, isError, error, data };
};
