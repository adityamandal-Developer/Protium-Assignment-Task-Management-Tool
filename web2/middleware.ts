import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!session) {
    // User is not authenticated
    if (pathname !== "/login" && pathname !== "/register") {
      // Redirect unauthenticated users to /login if trying to access other routes
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // User is authenticated
    if (pathname === "/login" || pathname === "/register") {
      // Redirect authenticated users away from /login or /register to the home page
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Allow the request to continue if it meets the criteria
  return NextResponse.next();
}

// Configure middleware to run only on specific routes
export const config = {
  matcher: ["/", "/register", "/login"],
};
