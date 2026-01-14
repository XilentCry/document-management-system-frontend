import { useQuery } from "@tanstack/react-query";
import { getAllOrganizationUnits, getOrganizationUnitContents } from "./api";

export const useGetAllOrganizationUnits = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["organization-units"],
    queryFn: getAllOrganizationUnits,
  });

  return { isLoading, isError, error, data };
};

export const useGetOrganizationUnitContents = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`organization-unit-${id}-contents`],
    queryFn: () => getOrganizationUnitContents(id),
  });

  return { isLoading, isError, error, data };
};
