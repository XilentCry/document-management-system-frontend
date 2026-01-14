"use client";

import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FolderGrid } from "@/components/user/shared/folder-grid";
import { FolderList } from "@/components/user/shared/folder-list";
import { UserBreadCrumb } from "@/components/user/shared/user-breadcrumb";
import { useGetOrganizationUnitContents } from "@/services/organization-units/queries";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
import { useViewModeStore } from "@/stores/view-mode-store";
import { LayoutGrid, TextAlignJustify } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function DepartmentDrivePage() {
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    isError,
    error,
    data: organizationUnitContents,
  } = useGetOrganizationUnitContents(id);

  const setCurrentOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.setCurrentOrganizationUnitId
  );
  const setCurrentParentFolderId = useFolderStore(
    (state) => state.setCurrentParentFolderId
  );
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);

  useEffect(() => {
    if (organizationUnitContents?.id) {
      setCurrentOrganizationUnitId(organizationUnitContents.id);
      setCurrentParentFolderId(null);
    }
  }, [
    organizationUnitContents?.id,
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
    organizationUnitContents && (
      <div className="flex-1 flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <UserBreadCrumb breadcrumb={organizationUnitContents.breadcrumb} />
          <ToggleGroup
            variant="outline"
            value={[viewMode]}
            onValueChange={(value) => {
              setViewMode(value[0] as "grid" | "list");
            }}
          >
            <ToggleGroupItem value="list">
              <TextAlignJustify />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid">
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {viewMode === "list" && organizationUnitContents.folders.length ? (
          <FolderList folders={organizationUnitContents.folders} />
        ) : null}
        {viewMode === "grid" && organizationUnitContents.folders.length ? (
          <FolderGrid folders={organizationUnitContents.folders} />
        ) : null}
      </div>
    )
  );
}
