"use client";

import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EmptyFiles } from "@/components/user/shared/empty-files";
import { ItemGrid } from "@/components/user/shared/item-grid";
import { ItemList } from "@/components/user/shared/item-list";
import { UserBreadCrumb } from "@/components/user/shared/user-breadcrumb";
import { useGetOrganizationUnitItems } from "@/services/organization-units/queries";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useViewModeStore } from "@/stores/view-mode-store";
import { LayoutGrid, List } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function DepartmentDrivePage() {
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    isError,
    error,
    data: organizationUnitItems,
  } = useGetOrganizationUnitItems(id);

  const setCurrentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.setCurrentOrganizationUnitId,
  );
  const setCurrentParentFolderId = useFolderStore(
    (state) => state.setCurrentParentFolderId,
  );
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);

  useEffect(() => {
    if (organizationUnitItems?.currentOrganizationUnitId) {
      setCurrentOrganizationUnitId(
        organizationUnitItems.currentOrganizationUnitId,
      );
      setCurrentParentFolderId(null);
    }
  }, [
    organizationUnitItems?.currentOrganizationUnitId,
    setCurrentOrganizationUnitId,
    setCurrentParentFolderId,
  ]);

  return isLoading ? (
    <div className="flex-1 flex items-center justify-center">
      <Spinner className="text-primary size-9" />
    </div>
  ) : isError && error ? (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-destructive text-sm">{error.message}</p>
    </div>
  ) : (
    organizationUnitItems && (
      <div className="flex-1 flex flex-col p-4 pt-0">
        <div className="flex items-center justify-between sticky top-14 bg-background z-10 py-4">
          <UserBreadCrumb breadcrumb={organizationUnitItems.breadcrumb} />
          <ToggleGroup
            variant="outline"
            value={[viewMode]}
            onValueChange={(value) => {
              if (!value[0]) return;

              setViewMode(value[0] as "grid" | "list");
            }}
          >
            <ToggleGroupItem value="list">
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid">
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {organizationUnitItems.data.length === 0 ? (
          <EmptyFiles />
        ) : viewMode === "list" ? (
          <ItemList
            data={organizationUnitItems.data}
            links={organizationUnitItems.links}
            meta={organizationUnitItems.meta}
          />
        ) : (
          <ItemGrid
            data={organizationUnitItems.data}
            links={organizationUnitItems.links}
            meta={organizationUnitItems.meta}
          />
        )}
      </div>
    )
  );
}
