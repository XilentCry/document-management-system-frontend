"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
  forgotPasswordFormSchema,
  TForgotPasswordFormSchema,
} from "@/schemas/auth/forgot-password-form-schema";
import { getCsrfCookie } from "@/services/auth/api";
import { useForgotPassword } from "@/services/reset-password/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<TForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: forgotPasswordMutation } =
    useForgotPassword();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<TForgotPasswordFormSchema> = async (data) => {
    await getCsrfCookie();
    await forgotPasswordMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend className="text-center">Forgot Password</FieldLegend>
        <FieldDescription className="text-center">
          Enter your NORSU email address and we&apos;ll send you a link to reset
          your password.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email"
                placeholder="Enter email"
                {...register("email")}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>@norsu.edu.ph</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>
          <Field>
            <Button type="submit">
              {isSubmitting ? (
                <>
                  <Spinner />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
