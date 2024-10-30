import RegisterForm from "@/components/auth/register-form";
import { cookies } from "next/headers";
export default async function RegisterPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <RegisterForm />
    </div>
  );
}
