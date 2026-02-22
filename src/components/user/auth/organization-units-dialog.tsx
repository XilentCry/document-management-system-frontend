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
import { ScrollArea } from "@/components/ui/scroll-area";
import { TRegisterFormSchema } from "@/schemas/auth/register-form-schema";
import { TOrganizationUnitTree } from "@/types/organization-unit-tree";
import { Plus, Search, X } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { Spinner } from "../../ui/spinner";
import { OrganizationUnitTreeNode } from "./organization-unit-tree-node";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";

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
  const { control } = useFormContext<TRegisterFormSchema>();

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
        : [...selectedIds, id],
    );
  };

  const removeOrganizationUnit = (id: number) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const flatOrganizationUnits = flattenOrganizationUnits(organizationUnits);
  const selectedOrganizationUnits = flatOrganizationUnits.filter((selectedId) =>
    selectedIds.includes(selectedId.id),
  );

  const filterOrganizationUnits = (
    organizationUnits: TOrganizationUnitTree[],
    searchTerm: string,
  ): TOrganizationUnitTree[] => {
    if (!searchTerm) return organizationUnits;
    const lower = searchTerm.toLowerCase();
    return organizationUnits
      .map((organizationUnit: TOrganizationUnitTree) => {
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
      })
      .filter(Boolean) as TOrganizationUnitTree[];
  };

  const filteredOrganizationUnits = filterOrganizationUnits(
    organizationUnits,
    searchTerm,
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
        <DialogTrigger render={<Button variant="outline" />}>
          <Plus />
          Select your office/s or unit/s
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
