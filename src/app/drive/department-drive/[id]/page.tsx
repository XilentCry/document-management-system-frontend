"use client";

import { Spinner } from "@/components/ui/spinner";
import FolderGrid from "@/components/user/folders/folder-grid";
import { useGetOrganizationUnitContents } from "@/services/organization-units/queries";
import { useFolderStore } from "@/stores/folder-store";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";
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
        {organizationUnitContents.folders.length ? (
          <FolderGrid folders={organizationUnitContents.folders} />
        ) : null}
      </div>
    )
  );
}
