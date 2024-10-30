"use client";
import { useRegister } from "@/hooks/useRegister.hook";
import { useState } from "react";
import Form from "./form";

const RegisterForm = () => {
  const { register, loading, error } = useRegister();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    await register({ email, password, name });
  };
  return (
    <Form
      formType="register"
      handleSubmit={handleSubmit}
      loading={loading}
      error={error}
    ></Form>
  );
};

export default RegisterForm;
