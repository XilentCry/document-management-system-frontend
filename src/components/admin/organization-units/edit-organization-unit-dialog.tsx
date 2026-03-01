import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TOrganizationUnitFlat } from "@/types/organization-unit-flat";
import { Dispatch, SetStateAction } from "react";

export function EditOrganizationUnitDialog({
  organizationUnit,
  openEditOrganizationUnitDialog,
  setOpenEditOrganizationUnitDialog,
}: {
  organizationUnit: TOrganizationUnitFlat;
  openEditOrganizationUnitDialog: boolean;
  setOpenEditOrganizationUnitDialog: Dispatch<SetStateAction<boolean>>;
}) {
  console.log(organizationUnit);
  return (
    <Dialog
      open={openEditOrganizationUnitDialog}
      onOpenChange={setOpenEditOrganizationUnitDialog}
    >
      <DialogContent className="w-150 max-w-150!">
        <form className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Edit organization unit</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" type="text" placeholder="Enter name" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
