import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  trashDocumentFormSchema,
  TTrashDocumentFormSchema,
} from "@/features/documents/schemas/trash-document-form-schema";
import { useTrashDocument } from "@/features/documents/api/mutations";
import { TItem } from "@/features/items/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

export function TrashDocumentDialog({
  item,
  openTrashDialog,
  setOpenTrashDialog,
}: {
  item: TItem;
  openTrashDialog: boolean;
  setOpenTrashDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<TTrashDocumentFormSchema>({
    resolver: zodResolver(trashDocumentFormSchema),
    defaultValues: {
      remarks: "",
    },
  });

  useEffect(() => {
    if (openTrashDialog) {
      reset();
    }
  }, [openTrashDialog, reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setOpenTrashDialog(false);
    }
  }, [isSubmitSuccessful, setOpenTrashDialog]);

  const { mutateAsync: trashDocumentMutation } = useTrashDocument();

  const onSubmit = async (data: TTrashDocumentFormSchema) => {
    await trashDocumentMutation({
      id: item.id,
      trashData: data,
    });
  };

  return (
    <AlertDialog open={openTrashDialog} onOpenChange={setOpenTrashDialog}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Move to trash?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move <strong>{item.name}</strong> to
              trash?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
              <Textarea
                id="remarks"
                placeholder="Why are you trashing this document?"
                {...register("remarks")}
              />
              {errors.remarks && (
                <FieldError>{errors.remarks.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Moving...
                </>
              ) : (
                "Move to trash"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
