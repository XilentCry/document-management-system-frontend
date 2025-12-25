"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  loginFormSchema,
  TLoginFormSchema,
} from "@/schemas/auth/login-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCsrfCookie, login } from "@/services/api/auth";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TLoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<TLoginFormSchema> = async (data) => {
    try {
      await getCsrfCookie();
      const { user, organizationUnitId } = await login(data);
      reset();
      if (user.role === "User") {
        router.replace(`/drive/department-drive/${organizationUnitId}`);
      } else {
        router.replace("/admin/user-management");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form className="px-4 sm:px-0" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              placeholder="Enter your email"
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
            placeholder="Enter your password"
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
              "Login"
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
