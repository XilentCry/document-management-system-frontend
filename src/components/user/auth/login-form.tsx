"use client";

import {
  loginFormSchema,
  TLoginFormSchema,
} from "@/schemas/auth/login-form-schema";
import { getCsrfCookie } from "@/services/auth/api";
import { useLogin } from "@/services/auth/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../../ui/input-group";
import { Spinner } from "../../ui/spinner";

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
    <form className="px-4 sm:px-0" onSubmit={handleSubmit(onSubmit)}>
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
        </Field>

        <Field className="text-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="hover:underline underline-offset-4"
            >
              Register
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  );
}
