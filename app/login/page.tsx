"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { authSchema } from "@/schema/authSchema";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/password-input";

export default function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;


  async function onSubmit(data: z.infer<typeof authSchema>) {
    const supabase = createClient();

    const { data: signinData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    console.log(error, "error");
    console.log(error?.message, "error?.message");
    if (error) {
    toast.error(error?.message || "Error logging in!");
    form.setValue("password", ""); 
  } else {
    toast.success("Login successful!");
    router.replace("/dashboard");
  }
  }

  return (
   <div className="flex items-center justify-center h-screen">
     <Card className="w-full sm:max-w-md p-5">
      <CardHeader className="p-0">
        <CardTitle className="text-fm-slate-800 font-semibold text-2xl">Finmate</CardTitle>
        <CardTitle className="text-fm-slate-900 font-semibold text-3xl">Signin</CardTitle>
        <CardDescription className="text-fm-slate-600 text-base font-normal">
          Access your financial insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-email" className="text-fm-slate-600 text-sm">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-password" className="text-fm-slate-600 text-sm">
                    Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="login-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="your password"
                    autoComplete="current-password"
                   />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
        <Field orientation="horizontal" className="flex items-center justify-center w-full">
          <Button type="submit" form="login-form" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Signin"}
          </Button>
        </Field>
        <p className="text-fm-slate-600 text-sm text-center">
            Forgot Password?
        </p>
    </Card>
   </div>
  );
}
