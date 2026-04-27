"use client";

import {
  loginFormSchema,
  TLoginFormSchema,
} from "@/features/auth/schemas/login-form-schema";
import { getCsrfCookie } from "@/features/auth/api/client";
import { useLogin } from "@/features/auth/api/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm() {
  "use no memo";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<TLoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: loginMutation, isError, error } = useLogin();

  useEffect(() => {
    if (isSubmitSuccessful || (isError && error.code === "ACCOUNT_PENDING")) {
      reset();
    }
  }, [isSubmitSuccessful, reset, isError, error?.code]);

  const onSubmit: SubmitHandler<TLoginFormSchema> = async (data) => {
    await getCsrfCookie();
    await loginMutation(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-sm hover:underline underline-offset-4"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register">Register</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
