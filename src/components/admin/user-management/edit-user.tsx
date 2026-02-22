import {
  TUpdateUserFormSchema,
  updateUserFormSchema,
} from "@/schemas/users/update-user-form-schema";
import { TOrganizationUnitBase } from "@/types/organization-unit-base";
import { TUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { TFormError } from "@/types/form-error";
import { useGetAllOrganizationUnitsTree } from "@/services/organization-units/queries";
import { Button } from "@/components/ui/button";
import { OrganizationUnitsDialog } from "./organization-units-dialog";
import { useUpdateUser } from "@/services/users/mutations";
import { useRouter } from "next/navigation";

export function EditUser({
  user,
}: {
  user: TUser & {
    organizationUnits: TOrganizationUnitBase[];
  };
}) {
  const [formErrors, setFormErrors] = useState<TFormError | null>(null);

  const router = useRouter();

  const methods = useForm<TUpdateUserFormSchema>({
    resolver: zodResolver(updateUserFormSchema(user.role)),
    defaultValues: {
      first_name: user.first_name,
      middle_name: user.middle_name ?? "",
      last_name: user.last_name,
      ...(user.role === "User" && {
        organization_unit_ids: user.organizationUnits.map(
          (organizationUnit) => organizationUnit.id,
        ),
      }),
      email: user.email,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const {
    isLoading,
    isError,
    error,
    data: organizationUnits = [],
  } = useGetAllOrganizationUnitsTree();
  const { mutateAsync: updateUserMutation } = useUpdateUser(
    setFormErrors,
    reset,
  );

  const onSubmit: SubmitHandler<TUpdateUserFormSchema> = async (data) => {
    await updateUserMutation({ userData: data, userId: user.id });
  };

  return (
    <FormProvider {...methods}>
      <form className="px-4 sm:px-0" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <Input {...methods.register("first_name")} />
            {errors.first_name && (
              <FieldError>{errors.first_name.message}</FieldError>
            )}
            {formErrors?.first_name && (
              <FieldError>{formErrors.first_name}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Middle Name</FieldLabel>
            <Input {...methods.register("middle_name")} />
            {errors.middle_name && (
              <FieldError>{errors.middle_name.message}</FieldError>
            )}
            {formErrors?.middle_name && (
              <FieldError>{formErrors.middle_name}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <Input {...methods.register("last_name")} />
            {errors.last_name && (
              <FieldError>{errors.last_name.message}</FieldError>
            )}
            {formErrors?.last_name && (
              <FieldError>{formErrors.last_name}</FieldError>
            )}
          </Field>
          {user.role === "User" && (
            <Field>
              <FieldLabel>Office / Unit</FieldLabel>
              <OrganizationUnitsDialog
                organizationUnits={organizationUnits}
                isLoading={isLoading}
                isError={isError}
                error={error}
              />
              {errors.organization_unit_ids && (
                <FieldError>{errors.organization_unit_ids.message}</FieldError>
              )}
            </Field>
          )}
          <Field>
            <FieldLabel>Email</FieldLabel>
            <InputGroup>
              <InputGroupInput {...methods.register("email")} />
              <InputGroupAddon align="inline-end">
                <InputGroupText>@norsu.edu.ph</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
            {formErrors?.email && <FieldError>{formErrors.email}</FieldError>}
          </Field>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(`/admin/user-management/view/${user.id}`)
              }
            >
              Cancel
            </Button>
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
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
