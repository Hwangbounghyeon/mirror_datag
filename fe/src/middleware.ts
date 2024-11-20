import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup", "/"];

export async function middleware(request: NextRequest) {
  const refreshTokenCookie = request.cookies.get("refreshToken");
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const res = NextResponse.next();

  if (path === "/") {
    return NextResponse.next();
  }

  if (refreshTokenCookie) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/project", request.url));
    } else return res;
  } else {
    if (isPublicRoute) {
      return res;
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
