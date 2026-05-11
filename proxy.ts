import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AuthenticationService } from "@/services/Authentication";
import { PermissionService } from "@/services/Permission";
import { PermissionOut } from "./types/permissionType";

// Don't need authentication
const publicRoutes = ["/login"];

// Route-permission mapping
const routePermissions: Record<string, string> = {
  "/": "ver:metricas",
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
      const permissions = await PermissionService.getByUserId(currentUser.id);

      // Check if the current route requires a specific permission
      const requiredPermission = routePermissions[pathname];

      if (requiredPermission) {
        // Check if user has the required permission
        const hasPermission = permissions.some(
          (permission: PermissionOut) =>
            permission.codigo === requiredPermission,
        );

        if (!hasPermission) {
          // → Redireciona para /login?error=unauthorized (sem loop!)
          const deniedUrl = new URL("/login", request.url);
          deniedUrl.searchParams.set("error", "unauthorized");
          return NextResponse.redirect(deniedUrl);
        }
      }
    } catch (error: unknown) {
      // If there's an error getting user info, redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
