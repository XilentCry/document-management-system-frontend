import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import type { TFormError } from "@/types/form-error";
import {
  inviteAdminFormSchema,
  type TInviteAdminFormSchema,
} from "@/schemas/users/invite-admin-form-schema";
import { useInviteAdmin } from "@/services/users/mutations";
import { getCsrfCookie } from "@/services/auth/api";

export function InviteAdminDialog({
  openInviteAdminDialog,
  setOpenInviteAdminDialog,
}: {
  openInviteAdminDialog: boolean;
  setOpenInviteAdminDialog: (open: boolean) => void;
}) {
  const [formErrors, setFormErrors] = useState<TFormError | null>(null);
  const { mutateAsync } = useInviteAdmin(setFormErrors);

  const form = useForm<TInviteAdminFormSchema>({
    resolver: zodResolver(inviteAdminFormSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
        reset();
        setOpenInviteAdminDialog(false);
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<TInviteAdminFormSchema> = async (data) => {
    await getCsrfCookie();
    await mutateAsync(data);
  };

  return (
    <Dialog open={openInviteAdminDialog} onOpenChange={setOpenInviteAdminDialog}>
      <DialogContent className="w-150 max-w-150!">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Invite Admin</DialogTitle>
          <DialogDescription>
            Create an admin account and send an invitation email so they can set
            their password.
          </DialogDescription>
        </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  placeholder="Enter first name"
                  {...form.register("first_name")}
                />
                {errors.first_name && (
                  <FieldError>{errors.first_name.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Middle Name</FieldLabel>
                <Input
                  placeholder="Enter middle name"
                  {...form.register("middle_name")}
                />
                {errors.middle_name && (
                  <FieldError>{errors.middle_name.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  placeholder="Enter last name"
                  {...form.register("last_name")}
                />
                {errors.last_name && (
                  <FieldError>{errors.last_name.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="Enter email"
                  {...form.register("email")}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
                {formErrors?.email && (
                  <FieldError>{formErrors.email[0]}</FieldError>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setOpenInviteAdminDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Sending invite...
                  </>
                ) : (
                  "Send Invite"
                )}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}