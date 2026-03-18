import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/portal/sign-in", "/forgot-password", "/reset-password"];

const rolePortalMap: Record<string, string> = {
  admin: "/portal/admin",
  staff: "/portal/staff",
  client: "/portal/client",
};

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
    role,
  });

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isProtectedRoute = Object.values(rolePortalMap).some((route) =>
    pathname.startsWith(route),
  );

  // SILENT REFRESH
  // access-token expired but refresh-token still valid
  if (!accessToken && refreshToken && isProtectedRoute) {
    try {
      const refreshResponse = await fetch(
        `${process.env.DJANGO_API_URL}/auth/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        },
      );

      if (refreshResponse.ok) {
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
      }
    } catch {
      // refresh failed — fall through to redirect below
    }
  }

  const isAuthenticated = !!accessToken;

  // add this after the role and token declarations
  // Generic /portal redirect — sends user to their dashboard based on role
  if (pathname === "/portal") {
    if (!isAuthenticated) {
      console.log("NOT AUTHENTICATED");
      return NextResponse.redirect(new URL("/portal/sign-in", request.url));
    }
    if (role && roleDashboardMap[role]) {
      console.log("ROLE DASHBOARD MAP", role, roleDashboardMap[role]);
      return NextResponse.redirect(
        new URL(roleDashboardMap[role], request.url),
      );
    }
    // authenticated but no role — clear and redirect to sign in
    const response = NextResponse.redirect(
      new URL("/portal/sign-in", request.url),
    );
    response.cookies.delete("access-token");
    response.cookies.delete("refresh-token");
    return response;
  }

  // 1. Not authenticated + protected route → redirect to sign in
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/portal/sign-in", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated but role missing → logout and start fresh
  // This handles returning users whose user-role cookie expired or was cleared
  if (isAuthenticated && isProtectedRoute && !role) {
    const response = NextResponse.redirect(
      new URL("/portal/sign-in", request.url),
    );
    response.cookies.delete("access-token");
    response.cookies.delete("refresh-token");
    return response;
  }

  // 3. Already authenticated + public route → redirect to their dashboard
  if (isPublicRoute && isAuthenticated) {
    const dashboard =
      role && roleDashboardMap[role]
        ? roleDashboardMap[role]
        : "/portal/admin/dashboard";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  if (isAuthenticated && role) {
    // 4. Visiting base portal path e.g /portal/admin → redirect to dashboard
    const basePortal = rolePortalMap[role];
    if (basePortal && pathname === basePortal) {
      return NextResponse.redirect(
        new URL(roleDashboardMap[role], request.url),
      );
    }

    // 5. Role-based access control
    // e.g staff trying to access /portal/admin → redirect to their own portal
    const ownPortal = rolePortalMap[role];
    const isAccessingWrongPortal =
      isProtectedRoute && !pathname.startsWith(ownPortal);

    if (isAccessingWrongPortal) {
      return NextResponse.redirect(
        new URL(roleDashboardMap[role], request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
