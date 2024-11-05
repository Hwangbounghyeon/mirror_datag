"use server";

import { cookies } from "next/headers";

import { LoginResponseType, RefreshResponseType } from "@/types/auth";

export const check_auth = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        error: "Invalid email or password",
        status: response.status,
      };
    }
    const data: LoginResponseType = await response.json();
    const cookieStore = await cookies();
    cookieStore.set({
      name: "refreshToken",
      value: data.refresh_token,
      httpOnly: true,
      path: process.env.NEXT_PUBLIC_FRONTEND_URL,
      maxAge: 60 * 60 * 7,
    });

    return {
      status: response.status,
      data: {
        accessToken: data.access_token,
        UserData: data.user,
      },
    };
  } catch (error) {
    return {
      error: "Something went wrong",
      status: 500,
    };
  }
};

export const refreshToken = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh?refresh_token=${refreshToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const data: RefreshResponseType = await response.json();
    return data.access_token;
  } catch (error) {
    return null;
  }
};
