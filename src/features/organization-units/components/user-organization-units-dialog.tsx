import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetUserOrganizationUnits } from "@/features/auth/api/me-queries";
import { Spinner } from "@/components/ui/spinner";
import { UserOrganizationUnitTreeNode } from "@/features/organization-units/components/user-organization-unit-tree-node";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { countTotalUnits } from "@/lib/count-total-units";
import { filterTree } from "@/lib/filter-tree";

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
  } = useGetUserOrganizationUnits(openUserOrganizationUnitsDialog);

  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchQuery("");
    }
    setOpenUserOrganizationUnitsDialog(open);
  };

  const totalUnits = countTotalUnits(userOrganizationUnits);

  const showSearchBar = totalUnits > 5;

  const filteredUnits = !userOrganizationUnits ? [] : filterTree(userOrganizationUnits, searchQuery);

  return (
    <Dialog
      open={openUserOrganizationUnitsDialog}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="w-250 max-w-250!">
        <DialogHeader>
          <DialogTitle>Organizational Structure</DialogTitle>
          <DialogDescription>Select your office or unit</DialogDescription>
        </DialogHeader>

        {showSearchBar && !isLoading && !isError && (
          <InputGroup>
            <InputGroupInput
              placeholder="Search offices or units..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        )}

        <ScrollArea className="h-96 min-w-0">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Spinner className="text-primary size-9" />
            </div>
          ) : isError && error ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-destructive text-sm">{error.message}</p>
            </div>
          ) : filteredUnits.length > 0 ? (
            filteredUnits.map((organizationUnit) => (
              <UserOrganizationUnitTreeNode
                key={organizationUnit.id}
                node={organizationUnit}
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No matching offices/units found.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}