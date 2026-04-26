"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  newSubmissionFormSchema,
  TNewSubmissionFormSchema,
} from "@/schemas/docuseal/new-submission-form-schema";
import { useCreateSubmission } from "@/services/docuseal/mutations";
import { TFormError } from "@/types/form-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Info } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

export function NewSubmissionDialog({
  openNewSubmissionDialog,
  setOpenNewSubmissionDialog,
  roles,
  templateId,
  documentId,
  onSubmissionCreated,
}: {
  openNewSubmissionDialog: boolean;
  setOpenNewSubmissionDialog: Dispatch<SetStateAction<boolean>>;
  roles: string[];
  templateId: number;
  documentId: string;
  onSubmissionCreated?: () => void;
}) {
  const [formErrors, setFormErrors] = useState<TFormError | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TNewSubmissionFormSchema>({
    resolver: zodResolver(newSubmissionFormSchema),
    defaultValues: {
      document_id: documentId,
      template_id: String(templateId),
      expire_at: "",
      submitters:
        roles.length > 0
          ? roles.map((role) => ({
              role,
              email: "",
            }))
          : [
              {
                role: "",
                email: "",
              },
            ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "submitters",
  });

  useEffect(() => {
    reset({
      document_id: documentId,
      template_id: String(templateId),
      expire_at: "",
      order: "preserved",
      send_email: true,
      submitters:
        roles.length > 0
          ? roles.map((role) => ({
              role,
              email: "",
            }))
          : [
              {
                role: "",
                email: "",
              },
            ],
    });
  }, [roles, templateId, documentId, reset]);

  const { mutateAsync: createSubmission } = useCreateSubmission(setFormErrors);

  const onSubmit: SubmitHandler<TNewSubmissionFormSchema> = async (data) => {
    await createSubmission(data);
    setOpenNewSubmissionDialog(false);
    onSubmissionCreated?.();
  };

  return (
    <Dialog
      open={openNewSubmissionDialog}
      onOpenChange={setOpenNewSubmissionDialog}
    >
      <DialogContent className="w-150 max-w-150!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>New Submission</DialogTitle>
          </DialogHeader>
          <ScrollArea className="min-h-0 max-h-96">
            <FieldGroup>
              {fields.map((field, index) => (
                <Field key={field.id}>
                  <FieldLabel htmlFor={`submitters.${index}.email`}>
                    {field.role}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={`submitters.${index}.email`}
                      placeholder="Enter email"
                      {...register(`submitters.${index}.email` as const)}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>@norsu.edu.ph</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.submitters?.[index]?.email && (
                    <FieldError>
                      {errors.submitters[index]?.email?.message}
                    </FieldError>
                  )}
                  {formErrors?.[`submitters.${index}.email`] && (
                    <FieldError>
                      {formErrors[`submitters.${index}.email`]}
                    </FieldError>
                  )}
                </Field>
              ))}
              <Controller
                control={control}
                name="expire_at"
                render={({ field: { value, onChange } }) => {
                  const dateObj = value ? new Date(value) : undefined;
                  return (
                    <Field>
                      <FieldLabel>Date expiration</FieldLabel>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="outline"
                              data-empty={!dateObj}
                              className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                            />
                          }
                        >
                          <CalendarIcon />
                          {dateObj ? (
                            format(dateObj, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateObj}
                            onSelect={(newDate) => {
                              onChange(newDate ? newDate.toISOString() : "");
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.expire_at && (
                        <FieldError>{errors.expire_at.message}</FieldError>
                      )}
                    </Field>
                  );
                }}
              />
              <Controller
                control={control}
                name="order"
                render={({ field: { value, onChange } }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="preserveOrder"
                      checked={value === "preserved"}
                      onCheckedChange={(checked) =>
                        onChange(checked ? "preserved" : "random")
                      }
                    />
                    <FieldLabel
                      htmlFor="preserveOrder"
                      className="font-normal gap-2"
                    >
                      Preserve order
                      <Tooltip>
                        <TooltipTrigger
                          render={<Button variant="ghost" size="icon" />}
                        >
                          <Info className="size-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            When checked, notifications will be sent to the
                            second party once the form is completed by the
                            previous party. Uncheck this option to send
                            notifications to all parties simultaneously right
                            away.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FieldLabel>
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="send_email"
                render={({ field: { value, onChange } }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="sendEmail"
                      checked={value}
                      onCheckedChange={onChange}
                    />
                    <FieldLabel htmlFor="sendEmail" className="font-normal">
                      Send email
                    </FieldLabel>
                  </Field>
                )}
              />
            </FieldGroup>
          </ScrollArea>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Adding...
                </>
              ) : (
                "Add Recipients"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
