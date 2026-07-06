import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/portal/sign-in",
  "/portal/sign-up",
  "/forgot-password",
  "/reset-password",
];

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

async function silentRefresh(
  refreshToken: string,
  response: NextResponse,
): Promise<string | null> {
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
      // cookie set here inside ok check
      response.cookies.set("access-token", data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 15,
        path: "/",
      });
      return data.access; // return new token
    }
    return null;
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let accessToken = request.cookies.get("access-token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;
  const role = request.cookies.get("user-role")?.value;
  

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isProtectedRoute = Object.values(rolePortalMap).some((route) =>
    pathname.startsWith(route),
  );

  // 1. Role check first — redirect wrong portal immediately
  if (role && isProtectedRoute) {
    const ownPortal = rolePortalMap[role];
    if (!pathname.startsWith(ownPortal)) {
      return NextResponse.redirect(
        new URL(roleDashboardMap[role], request.url),
      );
    }
  }

  // 2. Silent refresh
  if (!accessToken && refreshToken && isProtectedRoute) {
    const response = NextResponse.next();
    const newToken = await silentRefresh(refreshToken, response);
    if (newToken) {
      accessToken = newToken;
      return response;
    }
  }

  const isAuthenticated = !!accessToken;

  // 3. Generic /portal entry point
  const portalBasePaths = ["/portal", ...Object.values(rolePortalMap)];
  if (portalBasePaths.some((path) => pathname === path)) {
    if (!accessToken && refreshToken) {
      const redirectResponse = NextResponse.redirect(
        new URL(role ? roleDashboardMap[role] : "/portal/sign-in", request.url),
      );
      const newToken = await silentRefresh(refreshToken, redirectResponse);
      if (newToken && role) {
        return redirectResponse; // cookie already set inside silentRefresh
      }
    }

    if (!isAuthenticated || !role) {
      const response = NextResponse.redirect(
        new URL("/portal/sign-in", request.url),
      );
      response.cookies.delete("access-token");
      response.cookies.delete("refresh-token");
      return response;
    }

    return NextResponse.redirect(new URL(roleDashboardMap[role], request.url));
  }

  // 4. Not authenticated + protected route
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/portal/sign-in", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Already authenticated + public route
  if (isPublicRoute && isAuthenticated && role) {
    const dashboard = roleDashboardMap[role];
    if (dashboard) {
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
