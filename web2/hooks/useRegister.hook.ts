import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface UseRegisterResult {
  register: (data: RegisterData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useRegister = (): UseRegisterResult => {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }
      navigate.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
