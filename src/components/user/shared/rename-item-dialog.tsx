import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  renameItemFormSchema,
  TRenameItemFormSchema,
} from "@/schemas/items/rename-item-form-schema";
import { useRenameItem } from "@/services/items/mutations";
import { TItem } from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function RenameItemDialog({
  item,
  openRenameItemDialog,
  setOpenRenameItemDialog,
}: {
  item: TItem;
  openRenameItemDialog: boolean;
  setOpenRenameItemDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const isInSharedWithMe = pathname.includes("shared-with-me");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<TRenameItemFormSchema>({
    resolver: zodResolver(renameItemFormSchema),
    defaultValues: {
      name: item.name,
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setOpenRenameItemDialog(false);
    }
  }, [isSubmitSuccessful, reset, setOpenRenameItemDialog]);

  const { mutateAsync: renameItemMutation } = useRenameItem(
    item.is_folder ? "folder" : "document",
    isInSharedWithMe,
  );

  const onSubmit: SubmitHandler<TRenameItemFormSchema> = async (data) => {
    await renameItemMutation({
      id: item.id,
      renameData: data,
    });
  };

  return (
    <Dialog open={openRenameItemDialog} onOpenChange={setOpenRenameItemDialog}>
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => reset()}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Renaming...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
