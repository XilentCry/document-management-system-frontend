import { Button } from "@/components/ui/button";
import { ROOT_ORGANIZATION_UNIT_SLUG } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOrganizationUnitFlat } from "@/types/organization-unit-flat";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { EditOrganizationUnitDialog } from "./edit-organization-unit-dialog";

export function OrganizationUnitTable({
  organizationUnits,
}: {
  organizationUnits: TOrganizationUnitFlat[];
}) {
  const [openEditOrganizationUnitDialog, setOpenEditOrganizationUnitDialog] =
    useState(false);
  const [selectedOrganizationUnit, setSelectedOrganizationUnit] =
    useState<TOrganizationUnitFlat | null>(null);

  return (
    <>
      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Date created</TableHead>
              <TableHead>Date modified</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizationUnits.map((organizationUnit) => (
              <TableRow key={organizationUnit.id}>
                <TableCell>{organizationUnit.name}</TableCell>
                <TableCell>
                  {organizationUnit.parent?.name ?? <>&mdash;</>}
                </TableCell>
                <TableCell>{organizationUnit.created_at}</TableCell>
                <TableCell>{organizationUnit.updated_at}</TableCell>
                <TableCell>
                  {organizationUnit.slug !== ROOT_ORGANIZATION_UNIT_SLUG && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-sm" />}
                      >
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedOrganizationUnit(organizationUnit);
                              setOpenEditOrganizationUnitDialog(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {openEditOrganizationUnitDialog && selectedOrganizationUnit && (
        <EditOrganizationUnitDialog
          organizationUnit={selectedOrganizationUnit}
          openEditOrganizationUnitDialog={openEditOrganizationUnitDialog}
          setOpenEditOrganizationUnitDialog={setOpenEditOrganizationUnitDialog}
        />
      )}
    </>
  );
}
