import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterTree } from "@/lib/filter-tree";
import { TUpdateUserFormSchema } from "@/features/users/schemas/update-user-form-schema";
import { TOrganizationUnitTree } from "@/features/organization-units/types/organization-unit-tree";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { OrganizationUnitTreeNode } from "./organization-unit-tree-node";

function flattenOrganizationUnits(
  organizationUnits: TOrganizationUnitTree[],
  acc: TOrganizationUnitTree[] = [],
) {
  for (const organizationUnit of organizationUnits) {
    acc.push(organizationUnit);
    if (organizationUnit.children?.length) {
      flattenOrganizationUnits(organizationUnit.children, acc);
    }
  }
  return acc;
}

export function OrganizationUnitsDialog({
  organizationUnits,
  isLoading,
  isError,
  error,
}: {
  organizationUnits: TOrganizationUnitTree[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}) {
  const { control, setValue } = useFormContext<TUpdateUserFormSchema>();

  const selectedIds = useWatch({
    name: "organization_unit_ids",
    control,
  }) ?? [];

  const [searchTerm, setSearchTerm] = useState("");

  const toggleOrganizationUnit = (id: string) => {
    setValue(
      "organization_unit_ids",
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const removeOrganizationUnit = (id: string) => {
    setValue(
      "organization_unit_ids",
      selectedIds.filter((selectedId) => selectedId !== id),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const flatOrganizationUnits = flattenOrganizationUnits(organizationUnits);
  const selectedOrganizationUnits = flatOrganizationUnits.filter((selectedId) =>
    selectedIds.includes(selectedId.id),
  );

  const filteredOrganizationUnits = filterTree(organizationUnits, searchTerm);

  return (
    <>
      {selectedOrganizationUnits.length > 0 ? (
        <Card>
          <CardContent>
            <ScrollArea className="max-h-60 flex flex-col">
              <div className="flex-1 min-h-0 flex flex-wrap gap-2">
                {selectedOrganizationUnits.map((organizationUnit) => (
                  <Badge key={organizationUnit.id} variant="outline">
                    {organizationUnit.name}
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="w-fit"
                      onClick={() =>
                        removeOrganizationUnit(organizationUnit.id)
                      }
                    >
                      <X />
                    </Button>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}

      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          <Plus />
          Add office/unit
        </DialogTrigger>

        <DialogContent className="w-250 max-w-250!">
          <DialogHeader>
            <DialogTitle>Organizational Structure</DialogTitle>
            <DialogDescription>Select your office or unit</DialogDescription>
          </DialogHeader>
          <InputGroup>
            <InputGroupInput
              placeholder="Search an office or unit"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Spinner className="text-primary size-9" />
              </div>
            ) : isError && error ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            ) : filteredOrganizationUnits.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm">No results found.</p>
              </div>
            ) : (
              filteredOrganizationUnits.map((organizationUnit) => (
                <OrganizationUnitTreeNode
                  key={organizationUnit.id}
                  node={organizationUnit}
                  selectedIds={selectedIds}
                  onToggle={toggleOrganizationUnit}
                />
              ))
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
