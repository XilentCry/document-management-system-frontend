import { useQuery } from "@tanstack/react-query";
import {
  getAllOrganizationUnits,
  getOrganizationUnitFolders,
  getOrganizationUnitItems,
} from "./api";

export const useGetAllOrganizationUnits = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["organization-units"],
    queryFn: getAllOrganizationUnits,
  });

  return { isLoading, isError, error, data };
};

export const useGetOrganizationUnitItems = (id: string) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`organization-unit-${id}-items`],
    queryFn: () => getOrganizationUnitItems(id),
  });

  return { isLoading, isError, error, data };
};

export const useGetOrganizationUnitFolders = (
  organizationUnitId: number | null,
  folderId: number | null,
) => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`organization-unit-${organizationUnitId}-folders`],
    queryFn: () => getOrganizationUnitFolders(organizationUnitId),
    enabled: !!organizationUnitId && !folderId,
  });

  return { isLoading, isError, error, data };
};
