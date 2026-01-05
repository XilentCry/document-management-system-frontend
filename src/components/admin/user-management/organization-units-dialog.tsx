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
import { TUpdateUserFormSchema } from "@/schemas/users/update-user-form-schema";
import { TOrganizationUnit } from "@/types/organization-unit";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Spinner } from "../../ui/spinner";
import { OrganizationUnitTreeNode } from "./organization-unit-tree-node";

function flattenOrganizationUnits(
  organizationUnits: Pick<
    TOrganizationUnit,
    "id" | "name" | "parent_organization_unit_id" | "children"
  >[],
  acc: Pick<
    TOrganizationUnit,
    "id" | "name" | "parent_organization_unit_id" | "children"
  >[] = []
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
  organizationUnits: Pick<
    TOrganizationUnit,
    "id" | "name" | "parent_organization_unit_id" | "children"
  >[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}) {
  const { control } = useFormContext<TUpdateUserFormSchema>();

  const {
    field: { value: selectedIds, onChange },
  } = useController({
    name: "organization_unit_ids",
    control,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const toggleOrganizationUnit = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );
  };

  const removeOrganizationUnit = (id: number) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const flatOrganizationUnits = flattenOrganizationUnits(organizationUnits);
  const selectedOrganizationUnits = flatOrganizationUnits.filter((selectedId) =>
    selectedIds.includes(selectedId.id)
  );

  const filterOrganizationUnits = (
    organizationUnits: Pick<
      TOrganizationUnit,
      "id" | "name" | "parent_organization_unit_id" | "children"
    >[],
    searchTerm: string
  ): Pick<
    TOrganizationUnit,
    "id" | "name" | "parent_organization_unit_id" | "children"
  >[] => {
    if (!searchTerm) return organizationUnits;
    const lower = searchTerm.toLowerCase();
    return organizationUnits
      .map(
        (
          organizationUnit: Pick<
            TOrganizationUnit,
            "id" | "name" | "parent_organization_unit_id" | "children"
          >
        ) => {
          const children = organizationUnit.children
            ? filterOrganizationUnits(organizationUnit.children, searchTerm)
            : [];
          if (
            organizationUnit.name.toLowerCase().includes(lower) ||
            children.length > 0
          ) {
            return { ...organizationUnit, children };
          }
          return null;
        }
      )
      .filter(Boolean) as Pick<
      TOrganizationUnit,
      "id" | "name" | "parent_organization_unit_id" | "children"
    >[];
  };

  const filteredOrganizationUnits = filterOrganizationUnits(
    organizationUnits,
    searchTerm
  );

  return (
    <>
      {selectedOrganizationUnits.length > 0 && (
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
      )}

      <Dialog>
        <DialogTrigger render={<Button variant="secondary" />}>
          <Plus />
          Add office/unit
        </DialogTrigger>

        <DialogContent>
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
          <ScrollArea className="h-60">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Spinner className="text-primary" />
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
