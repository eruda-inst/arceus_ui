import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AuthenticationService } from "@/services/Authentication";
import { PermService } from "@/services/Perm";
import { PermOut } from "./types/perm.type";

// Don't need authentication
const publicRoutes = ["/login"];

// Route-permission mapping
const routePerms: Record<string, string> = {
  "/": "ver:metricas",
  "/logs": "ver:logs",
  "/usuarios": "ver:usuarios",
};

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  // 1. Ignore authentication on static files and Next.js internal routes
  if (
    url.searchParams.has("_rsc") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // For static files with extensions
  ) {
    return NextResponse.next();
  }

  // Get the token
  const accessToken = request.cookies.get("access_token")?.value;
  const hasToken = !!accessToken;

  // Verify if the current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // MAIN LOGIC:

  // 1. If there is no token and we are trying to access a protected route -> redirect to /login
  if (!hasToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If there is token and it is trying to access a public route (login)
  //    EXCEPT when it's /login with error=unauthorized (show access denied)
  if (hasToken && isPublicRoute) {
    if (
      pathname === "/login" &&
      url.searchParams.get("error") === "unauthorized"
    ) {
      // Allow the request to go through so login page can display the message
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Check permissions for protected routes when user has token
  if (hasToken && !isPublicRoute) {
    try {
      const currentUser = await AuthenticationService.getMe(accessToken);
      const perms = await PermService.getByUserId(currentUser.id);

      // Check if the current route requires a specific permission
      const reqPerm = routePerms[pathname];

      if (reqPerm) {
        // Check if user has the required permission
        const hasPerm = perms.some((perm: PermOut) => perm.codigo === reqPerm);

        if (!hasPerm) {
          // → Redireciona para /login?error=unauthorized (sem loop!)
          const deniedUrl = new URL("/login", request.url);
          deniedUrl.searchParams.set("error", "unauthorized");
          return NextResponse.redirect(deniedUrl);
        }
      }
    } catch (error: unknown) {
      // If there's an error getting user info, redirect to login
      const loginUrl = new URL("/login", request.url);
      console.error(error);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
