"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";

interface FormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error?: string | undefined | null;
  loading: boolean;
  formType: "register" | "login";
}

const Form: React.FC<FormProps> = ({
  handleSubmit,
  error,
  loading,
  formType,
}) => {
  return (
    <Card className="mx-auto min-w-[384px]">
      <CardHeader>
        <CardTitle className="text-2xl">{formType}</CardTitle>
        <CardDescription>
          {formType === "register"
            ? "Register new account"
            : "Enter your email below to login to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">
              {error}
            </div>
          )}
          {formType === "register" ? (
            <div className="grid gap-2">
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                name="name"
                type="name"
                placeholder="Jhon Doe"
                required
              />
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>

          <Button type="submit" className="w-full">
            {formType === "register"
              ? loading
                ? "registering..."
                : "register"
              : loading
              ? "loggin in..."
              : "log in"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {formType === "register"
            ? "Already have an account?"
            : "Don't have an account?"}

          <Link
            href={formType === "register" ? "/login" : "/register"}
            className="underline"
          >
            {formType === "register" ? " Login" : " Sign up"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Form;
