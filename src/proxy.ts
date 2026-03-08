import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/portal/sign-in", "/forgot-password", "/reset-password"];

/**
 * Role to portal mapping
 * Defines which base path each role owns
 */
const rolePortalMap: Record<string, string> = {
  admin: "/portal/admin",
  staff: "/portal/staff",
  client: "/portal/client",
};

/**
 * Role to default dashboard mapping
 * Where each role lands after login or when visiting their base path
 */
const roleDashboardMap: Record<string, string> = {
  admin: "/portal/admin/dashboard",
  staff: "/portal/staff/dashboard",
  client: "/portal/client/dashboard",
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let accessToken = request.cookies.get("access-token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;
  const role = request.cookies.get("user-role")?.value;
  
  console.log("proxy running:", { 
  pathname, 
  accessToken: !!accessToken, 
  refreshToken: !!refreshToken, 
  role 
});

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = Object.values(rolePortalMap).some((route) =>
    pathname.startsWith(route)
  );

    if (!accessToken && refreshToken && isProtectedRoute) {
      console.log("attempting silent refresh...")
    try {
      const refreshResponse = await fetch(
        `${process.env.DJANGO_API_URL}/auth/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      console.log("refresh status:", refreshResponse.status)
      if (refreshResponse.ok) {
        console.log("refresh successful")
        const data = await refreshResponse.json();
        accessToken = data.access;

        const response = NextResponse.next();
        response.cookies.set("access-token", data.access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 15,
          path: "/",
        });
        return response;
      } else {
      console.log("refresh failed:", await refreshResponse.text())
    }
  } catch (err) {
    console.log("refresh error:", err)
  }
  }

  const isAuthenticated = !!accessToken;

  // 1. Not authenticated + protected route → redirect to sign in
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/portal/sign-in", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already authenticated + public route → redirect to their dashboard
  if (isPublicRoute && isAuthenticated) {
    const role = request.cookies.get("user-role")?.value ?? "admin";
    const dashboard = roleDashboardMap[role] ?? "/portal/admin/dashboard";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  if (isAuthenticated) {
    const role = request.cookies.get("user-role")?.value;

    // 3. Visiting base portal path e.g /portal/admin → redirect to dashboard
    const basePortal = role ? rolePortalMap[role] : null;
    if (basePortal && pathname === basePortal) {
      return NextResponse.redirect(
        new URL(roleDashboardMap[role!], request.url)
      );
    }

    // 4. Role-based access control
    // e.g staff trying to access /portal/admin → redirect to their own portal
    if (role) {
      const ownPortal = rolePortalMap[role];
      const isAccessingWrongPortal =
        isProtectedRoute && !pathname.startsWith(ownPortal);

      if (isAccessingWrongPortal) {
        return NextResponse.redirect(
          new URL(roleDashboardMap[role], request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};