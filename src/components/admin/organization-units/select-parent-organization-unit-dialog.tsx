import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";
import { useGetAllOrganizationUnitsTree } from "@/services/organization-units/queries";
import { Spinner } from "../../ui/spinner";
import { SelectableOrganizationUnitTreeNode } from "./selectable-organization-unit-tree-node";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { filterTree } from "@/lib/filter-tree";
import { Button } from "@/components/ui/button";

export function SelectParentOrganizationUnitDialog({
  selectedId,
  selectedParentName,
  onSelect,
}: {
  selectedId: string | undefined;
  selectedParentName: string | null;
  onSelect: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: organizationUnits,
  } = useGetAllOrganizationUnitsTree();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  const filteredUnits = !organizationUnits ? [] : filterTree(organizationUnits, searchQuery);

  const handleSelect = (id: string, name: string) => {
    onSelect(id, name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
          />
        }
      >
        <span className={selectedParentName ? "" : "text-muted-foreground"}>
          {selectedParentName ?? "Select parent organization unit..."}
        </span>
      </DialogTrigger>
      <DialogContent className="w-250 max-w-250!">
        <DialogHeader>
          <DialogTitle>Select Parent Organization Unit</DialogTitle>
          <DialogDescription>Select the parent office or unit</DialogDescription>
        </DialogHeader>

        {!isLoading && !isError && (
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
              <SelectableOrganizationUnitTreeNode
                key={organizationUnit.id}
                node={organizationUnit}
                selectedId={selectedId}
                onSelect={handleSelect}
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
