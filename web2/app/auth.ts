import { authOptions } from "@/authOptions";
import NextAuth from "next-auth";

export const { auth } = NextAuth(authOptions);
