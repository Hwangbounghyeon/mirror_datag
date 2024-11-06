import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  accessTokenDuration,
  refreshTokenDuration,
} from "./lib/constants/token-duration";
import { DefaultResponseType } from "./types/default";
import { RefreshResponseType } from "./types/auth";

const publicRoutes = ["/login", "/signup", "/"];

export async function middleware(request: NextRequest) {
  const refreshTokenCookie = request.cookies.get("refreshToken");
  const accessTokenCookie = request.cookies.get("accessToken");
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const res = NextResponse.next();

  // 엑세스 토큰 있을 경우, 공개 페이지로 접근 시 대시보드로 리다이렉트
  if (accessTokenCookie) {
    res.headers.set("Authorization", `Bearer ${accessTokenCookie.value}`);
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/project", request.url));
    }
    return res;
  }

  // refreshToken이 남아있는 경우
  if (refreshTokenCookie) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh?refresh_token=${refreshTokenCookie.value}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response || !response.ok || response.status >= 400) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      const data: DefaultResponseType<RefreshResponseType> =
        await response.json();
      if (!data?.data) {
        res.cookies.set({
          name: "accessToken",
          value: "",
          httpOnly: true,
          path: process.env.NEXT_PUBLIC_FRONTEND_URL,
          maxAge: 0,
        });
        res.cookies.set({
          name: "refreshToken",
          value: "",
          httpOnly: true,
          path: process.env.NEXT_PUBLIC_FRONTEND_URL,
          maxAge: 0,
        });
        return NextResponse.redirect(new URL("/login", request.url));
      }

      res.cookies.set({
        name: "accessToken",
        value: data.data.access_token,
        httpOnly: true,
        path: process.env.NEXT_PUBLIC_FRONTEND_URL,
        maxAge: accessTokenDuration,
      });
      res.cookies.set({
        name: "refreshToken",
        value: data.data.refresh_token,
        httpOnly: true,
        path: process.env.NEXT_PUBLIC_FRONTEND_URL,
        maxAge: refreshTokenDuration,
      });
      res.headers.set("Authorization", `Bearer ${data.data.access_token}`);

      return res;
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 토큰이 없는 경우
  if (!isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
