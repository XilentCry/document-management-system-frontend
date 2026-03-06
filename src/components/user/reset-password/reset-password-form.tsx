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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  resetPasswordFormSchema,
  TResetPasswordFormSchema,
} from "@/schemas/auth/reset-password-form-schema";
import { getCsrfCookie } from "@/services/auth/api";
import { useResetPassword } from "@/services/reset-password/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

type ResetPasswordFormProps = {
  token: string;
  email: string;
};

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token,
      email,
      password: "",
      password_confirmation: "",
    },
  });

  const { mutateAsync: resetPasswordMutation } = useResetPassword();

  const onSubmit: SubmitHandler<TResetPasswordFormSchema> = async (data) => {
    await getCsrfCookie();
    await resetPasswordMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend className="text-center">Reset Password</FieldLegend>
        <FieldDescription className="text-center">
          Enter your new password below.
        </FieldDescription>
        <FieldGroup>
          <input type="hidden" {...register("token")} />
          <input type="hidden" {...register("email")} />
          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              {...register("password")}
            />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password_confirmation">
              Confirm Password
            </FieldLabel>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Confirm new password"
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && (
              <FieldError>{errors.password_confirmation.message}</FieldError>
            )}
          </Field>
          <Field>
            <Button type="submit">
              {isSubmitting ? (
                <>
                  <Spinner />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

