"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
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
import { useGetAllOrganizationUnitsTree } from "@/services/organization-units/queries";
import { TFormError } from "@/types/form-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle, CircleX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { OrganizationUnitsDialog } from "./organization-units-dialog";

export function RegisterForm() {
  const [formErrors, setFormErrors] = useState<TFormError | null>(null);

  const form = useForm<TRegisterFormSchema>({
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
    formState: { errors, isSubmitting, isSubmitSuccessful, isSubmitted },
  } = form;

  const watchedPassword = useWatch({ control: form.control, name: "password" });

  const {
    isLoading,
    isError,
    error,
    data: organizationUnits = [],
  } = useGetAllOrganizationUnitsTree();
  const { mutateAsync: registerMutation } = useRegister(setFormErrors);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<TRegisterFormSchema> = async (data) => {
    await getCsrfCookie();
    await registerMutation(data);
  };

  return (
    <FormProvider {...form}>
      <form className="px-4 sm:px-0" onSubmit={handleSubmit(onSubmit)}>
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
            {formErrors?.first_name && (
              <FieldError>{formErrors.first_name}</FieldError>
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
            {formErrors?.middle_name && (
              <FieldError>{formErrors.middle_name}</FieldError>
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
            <FieldDescription>
              Select your office/s or unit/s you are currently assigned to.
            </FieldDescription>
            {errors.organization_unit_ids && (
              <FieldError>{errors.organization_unit_ids.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                placeholder="Enter email"
                {...form.register("email")}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>@norsu.edu.ph</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>
              Use your official NORSU email address.
            </FieldDescription>
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
            {formErrors?.email && <FieldError>{formErrors.email}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Enter password"
              {...form.register("password")}
            />
            <>
              {[
                { label: "At least 8 characters", regex: /.{8,}/ },
                { label: "One uppercase letter", regex: /[A-Z]/ },
                { label: "One lowercase letter", regex: /[a-z]/ },
                { label: "One number", regex: /[0-9]/ },
                { label: "One symbol (e.g. !@#$%)", regex: /[^a-zA-Z0-9]/ },
              ].map(({ label, regex }) => {
                const passed = regex.test(watchedPassword);
                const showError = isSubmitted && !passed;

                return (
                  <div
                    key={label}
                    className={`flex items-center gap-2 ${
                      passed
                        ? "text-green-500"
                        : showError
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    {passed ? (
                      <CheckCircle2 className="size-4" />
                    ) : showError ? (
                      <CircleX className="size-4 text-destructive" />
                    ) : (
                      <Circle className="size-4" />
                    )}
                    <FieldDescription>{label}</FieldDescription>
                  </div>
                );
              })}
            </>
            {formErrors?.password && (
              <FieldError>{formErrors.password}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <Input
              type="password"
              placeholder="Confirm your password"
              {...form.register("password_confirmation")}
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
          <Field className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/"
                className="hover:text-primary underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
