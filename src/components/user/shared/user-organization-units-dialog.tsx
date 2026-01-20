import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";
import { useGetUserOrganizationUnits } from "@/services/user/queries";
import { Spinner } from "../../ui/spinner";
import { UserOrganizationUnitTreeNode } from "./user-organization-unit-tree-node";

export function UserOrganizationUnitsDialog({
  openUserOrganizationUnitsDialog,
  setOpenUserOrganizationUnitsDialog,
}: {
  openUserOrganizationUnitsDialog: boolean;
  setOpenUserOrganizationUnitsDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    isLoading,
    isError,
    error,
    data: userOrganizationUnits,
  } = useGetUserOrganizationUnits();

  return (
    <Dialog
      open={openUserOrganizationUnitsDialog}
      onOpenChange={setOpenUserOrganizationUnitsDialog}
    >
      <DialogContent className="w-250 max-w-250!">
        <DialogHeader>
          <DialogTitle>Organizational Structure</DialogTitle>
          <DialogDescription>Select your office or unit</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 min-w-0">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Spinner className="text-primary size-9" />
            </div>
          ) : isError && error ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-destructive text-sm">{error.message}</p>
            </div>
          ) : (
            userOrganizationUnits?.map((organizationUnit) => (
              <UserOrganizationUnitTreeNode
                key={organizationUnit.id}
                node={organizationUnit}
              />
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
