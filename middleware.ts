import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  // Admin gate: Supabase session required. admin_users membership is
  // enforced by requireAdmin() in the protected admin layout.
  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/admin/wedding-invitations") &&
    !path.startsWith("/admin/wedding-invitations/login") &&
    !user
  ) {
    const login = new URL("/admin/wedding-invitations/login", request.url);
    const redirect = NextResponse.redirect(login);
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return redirect;
  }

  // Belt-and-suspenders with the admin layout metadata: never let crawlers
  // index any admin route, whatever the response type.
  if (path.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
