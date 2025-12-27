import { useQuery } from "@tanstack/react-query";
import { getAllOrganizationUnits } from "./api";

export const useGetAllOrganizationUnits = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["organization-units"],
    queryFn: getAllOrganizationUnits,
  });

  return { isLoading, isError, error, data };
};
