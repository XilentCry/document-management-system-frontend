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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  changeClassificationFormSchema,
  TChangeClassificationFormSchema,
} from "@/features/documents/schemas/change-classification-form-schema";
import { useGetAllClassifications } from "@/features/classifications/api/queries";
import { useUpdateClassification } from "@/features/documents/api/mutations";
import { TItem } from "@/features/items/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export function ChangeClassificationDialog({
  item,
  openChangeClassificationDialog,
  setOpenChangeClassificationDialog,
}: {
  item: TItem;
  openChangeClassificationDialog: boolean;
  setOpenChangeClassificationDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: classificationsData } = useGetAllClassifications(
    openChangeClassificationDialog,
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<TChangeClassificationFormSchema>({
    resolver: zodResolver(changeClassificationFormSchema),
    defaultValues: {
      classification_id: item.classification === "public" ? classificationsData?.find((c) => c.name === "public")?.id : item.classification === "private" ? classificationsData?.find((c) => c.name === "private")?.id : item.classification === "protected" ? classificationsData?.find((c) => c.name === "protected")?.id : "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      setOpenChangeClassificationDialog(false);
    }
  }, [isSubmitSuccessful, setOpenChangeClassificationDialog]);

  useEffect(() => {
    if (classificationsData && item.classification) {
      const selectedClass = classificationsData.find(
        (c) => c.name === item.classification
      );
      if (selectedClass) {
        reset({ classification_id: selectedClass.id });
      } else {
        reset({ classification_id: "" });
      }
    } else {
      reset({ classification_id: "" });
    }
  }, [classificationsData, item, reset, openChangeClassificationDialog]);

  const { mutateAsync: updateClassificationMutation } =
    useUpdateClassification();

  const onSubmit: SubmitHandler<TChangeClassificationFormSchema> = async (
    data,
  ) => {
    await updateClassificationMutation({
      id: item.id,
      classificationData: data,
    });
  };

  return (
    <Dialog
      open={openChangeClassificationDialog}
      onOpenChange={setOpenChangeClassificationDialog}
    >
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Change classification</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="classification_id">
                Classification
              </FieldLabel>
              <Controller
                control={control}
                name="classification_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue>
                        {
                          classificationsData?.find(
                            (c) => c.id === field.value,
                          )?.name
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {classificationsData?.map((classification) => (
                        <SelectItem
                          key={classification.id}
                          value={classification.id}
                          className="capitalize"
                        >
                          {classification.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.classification_id && (
                <FieldError>{errors.classification_id.message}</FieldError>
              )}
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
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
