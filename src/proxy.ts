import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";

/**
 * This middleware function checks if the user is authenticated before allowing access to the /settings route.
 */
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if(!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/settings/:path*" // protect the /settings route and all its subpaths
};