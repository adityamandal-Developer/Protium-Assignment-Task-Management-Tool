// app/api/get-token/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("next-auth.session-token");

  if (token) {
    return NextResponse.json({ accessToken: token.value });
  } else {
    return NextResponse.json({ accessToken: null }, { status: 401 });
  }
}
