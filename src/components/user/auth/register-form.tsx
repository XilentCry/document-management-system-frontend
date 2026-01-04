"use client";

import { Button } from "@/components/ui/button";
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
import {
  registerFormSchema,
  type TRegisterFormSchema,
} from "@/schemas/auth/register-form-schema";
import { getCsrfCookie } from "@/services/auth/api";
import { useRegister } from "@/services/auth/mutations";
import { useGetAllOrganizationUnits } from "@/services/organization-units/queries";
import { TFormError } from "@/types/form-error";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { OrganizationUnitsDialog } from "./organization-units-dialog";

export function RegisterForm() {
  const [formErrors, setFormErrors] = useState<TFormError | null>(null);

  const methods = useForm<TRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      organization_unit_ids: [],
      email: "",
      password: "",
      password_confirmation: "",
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
  } = useGetAllOrganizationUnits();
  const { mutateAsync: registerMutation } = useRegister(setFormErrors, reset);

  const onSubmit: SubmitHandler<TRegisterFormSchema> = async (data) => {
    await getCsrfCookie();
    await registerMutation(data);
  };

  return (
    <FormProvider {...methods}>
      <form className="px-4 sm:px-0" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <Input
              placeholder="Enter your first name"
              {...methods.register("first_name")}
            />
            {errors.first_name && (
              <FieldError>{errors.first_name.message}</FieldError>
            )}
            {formErrors?.first_name && (
              <FieldError>{formErrors.first_name}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Middle Name</FieldLabel>
            <Input
              placeholder="Enter your middle name"
              {...methods.register("middle_name")}
            />
            {errors.middle_name && (
              <FieldError>{errors.middle_name.message}</FieldError>
            )}
            {formErrors?.middle_name && (
              <FieldError>{formErrors.middle_name}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <Input
              placeholder="Enter your last name"
              {...methods.register("last_name")}
            />
            {errors.last_name && (
              <FieldError>{errors.last_name.message}</FieldError>
            )}
            {formErrors?.last_name && (
              <FieldError>{formErrors.last_name}</FieldError>
            )}
          </Field>
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
          <Field>
            <FieldLabel>Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                placeholder="Enter your email"
                {...methods.register("email")}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>@norsu.edu.ph</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
            {formErrors?.email && <FieldError>{formErrors.email}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              {...methods.register("password")}
            />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <Input
              type="password"
              placeholder="Confirm your password"
              {...methods.register("password_confirmation")}
            />
            {errors.password_confirmation && (
              <FieldError>{errors.password_confirmation.message}</FieldError>
            )}
          </Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="hover:underline underline-offset-4">
              Log in
            </Link>
          </p>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
