import { useQuery } from "@tanstack/react-query";
import { getItemActivities } from "./api";

export const useGetItemActivities = (
  id: number | null,
  isRailTabActivity: boolean,
) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`item-${id}-activities`],
    queryFn: () => getItemActivities(id),
    enabled: !!id && isRailTabActivity,
  });

  return { isLoading, isError, error, data };
};
