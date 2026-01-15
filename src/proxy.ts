import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/" || pathname.startsWith("/register");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        headers: {
          Accept: "application/json",
          Cookie: request.headers.get("cookie") ?? "",
          Origin: process.env.FRONTEND_URL!,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      if (isAuthPage) {
        if (data.user.role === "User") {
          return NextResponse.redirect(
            new URL(
              `/drive/department-drive/${data.currentOrganizationUnitId}`,
              request.url
            )
          );
        } else if (data.user.role === "Admin") {
          return NextResponse.redirect(
            new URL("/admin/user-management", request.url)
          );
        }
      }

      if (data.user.role === "User" && pathname.startsWith("/admin")) {
        return NextResponse.redirect(
          new URL(
            `/drive/department-drive/${data.currentOrganizationUnitId}`,
            request.url
          )
        );
      } else if (data.user.role === "Admin" && pathname.startsWith("/drive")) {
        return NextResponse.redirect(
          new URL("/admin/user-management", request.url)
        );
      }
    }

    if (!response.ok && !isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/register", "/admin/:path*", "/drive/:path*"],
};
