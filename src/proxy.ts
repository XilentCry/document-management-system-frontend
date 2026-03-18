import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isAuthPage = pathname === "/" || pathname.startsWith("/register") || pathname.startsWith("/reset-password") || pathname.startsWith("/set-password");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
      {
        headers: {
          Accept: "application/json",
          Cookie: request.headers.get("cookie") ?? "",
          Origin: process.env.NEXT_PUBLIC_FRONTEND_URL!,
        },
      },
    );

    if (!response.ok && !isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (response.ok) {
      const data = await response.json();

      if (isAuthPage) {
        if (data.user.role === "user") {
          return NextResponse.redirect(
            new URL(
              `/drive/organizational-drive/${data.currentOrganizationUnitId}`,
              request.url,
            ),
          );
        } else if (
          data.user.role === "admin" ||
          data.user.role === "superuser"
        ) {
          return NextResponse.redirect(
            new URL("/admin/user-management", request.url),
          );
        }
      }

      if (data.user.role === "user" && pathname.startsWith("/admin")) {
        return NextResponse.redirect(
          new URL(
            `/drive/organizational-drive/${data.currentOrganizationUnitId}`,
            request.url,
          ),
        );
      } else if (
        (data.user.role === "admin" || data.user.role === "superuser") 
        && pathname.startsWith("/drive")
      ) {
        return NextResponse.redirect(
          new URL("/admin/user-management", request.url),
        );
      }

      if (pathname === "/drive/search" && !searchParams.get("q")) {
        return NextResponse.redirect(
          new URL(
            `/drive/organizational-drive/${data.currentOrganizationUnitId}`,
            request.url,
          ),
        );
      }
    }

    if (
      (pathname === "/reset-password" || pathname === "/set-password") &&
      (!searchParams.get("token") || !searchParams.get("email"))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/register",
    "/reset-password",
    "/set-password",
    "/admin/:path*",
    "/drive/:path*",
  ],
};
