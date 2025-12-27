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
import { TOrganizationUnit } from "@/types/organization-unit";
import { Plus, X } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { Spinner } from "../../ui/spinner";
import { OrganizationUnitTreeNode } from "./organization-unit-tree-node";

function flattenOrganizationUnits(
  organizationUnits: TOrganizationUnit[],
  acc: TOrganizationUnit[] = []
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
  organizationUnits: TOrganizationUnit[];
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

  return (
    <>
      {selectedOrganizationUnits.length > 0 && (
        <Card>
          <CardContent className="flex flex-wrap gap-2">
            {selectedOrganizationUnits.map((unit) => (
              <Badge key={unit.id} variant="outline">
                {unit.name}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="w-fit"
                  onClick={() => removeOrganizationUnit(unit.id)}
                >
                  <X />
                </Button>
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog>
        <DialogTrigger
          render={
            <Button variant="secondary">
              <Plus />
              Add office/unit
            </Button>
          }
        />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Organizational Structure</DialogTitle>
            <DialogDescription>Select your office or unit</DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-60">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Spinner className="text-primary" />
              </div>
            ) : isError && error ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            ) : (
              organizationUnits.map((unit) => (
                <OrganizationUnitTreeNode
                  key={unit.id}
                  node={unit}
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
