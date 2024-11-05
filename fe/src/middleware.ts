// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup", "/"];

export function middleware(request: NextRequest) {
  const refreshTokenCookie = request.cookies.get("refreshToken");
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // 로그인된 상태 (refreshToken이 있는 경우)
  if (refreshTokenCookie) {
    // 공개 페이지 접근 시도하면 /project로 리다이렉트
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/project", request.url));
    }
    // 그 외의 경우는 정상적으로 접근 허용
    return NextResponse.next();
  }

  // 로그인되지 않은 상태 (refreshToken이 없는 경우)
  // 공개 페이지가 아닌 곳에 접근 시도하면 /login으로 리다이렉트
  if (!isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 공개 페이지는 정상적으로 접근 허용
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
