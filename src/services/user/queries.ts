import { useQuery } from "@tanstack/react-query";
import { getUserOrganizationUnits } from "./api";

export const useGetUserOrganizationUnits = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["user", "organization-units"],
    queryFn: getUserOrganizationUnits,
  });

  return { isLoading, isError, error, data };
};
