"use server";

import { cookies } from "next/headers";

import { LoginResponseType, RefreshResponseType } from "@/types/auth";

export const check_auth = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  if (!email || !password) {
    return {
      status: 400,
      error: "Email and password are required",
    };
  }
  console.log("login try");
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
    console.log("response", response);

    if (!response.ok) {
      console.log("login fail");
      return {
        error: "Invalid email or password",
        status: response.status,
      };
    }
    console.log("login success");

    const data: LoginResponseType = await response.json();
    console.log(data);
    const cookieStore = await cookies();

    cookieStore.set({
      name: "refreshToken",
      value: data.refresh_token,
      httpOnly: true,
      path: process.env.NEXT_PUBLIC_FRONTEND_URL,
      maxAge: 60 * 60 * 7,
    });

    cookieStore.set({
      name: "accessToken",
      value: data.access_token,
      httpOnly: true,
      path: process.env.NEXT_PUBLIC_FRONTEND_URL,
      maxAge: 60 * 20,
    });

    return {
      status: response.status,
      data: {
        UserData: data.user,
      },
    };
  } catch (error) {
    console.log("login fail");
    return {
      error: "Something went wrong",
      status: 500,
    };
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken");
  if (!refreshToken) return null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh?refresh_token=${refreshToken.value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      cookieStore.delete("refreshToken");
      cookieStore.delete("accessToken");
      return null;
    }

    const data: RefreshResponseType = await response.json();

    cookieStore.set({
      name: "accessToken",
      value: data.access_token,
      httpOnly: true,
      maxAge: 60 * 20,
    });
    return data.access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    cookieStore.delete("refreshToken");
    cookieStore.delete("accessToken");
    return null;
  }
};

export const logout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    cookies().delete("refreshToken");
    cookies().delete("accessToken");
    return null;
  }
};

export const getAccessToken = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  if (accessToken) {
    return accessToken.value;
  } else {
    if (refreshToken) {
      const result = await refreshAccessToken();
      if (result) {
        cookieStore.set({
          name: "accessToken",
          value: result,
          httpOnly: true,
          maxAge: 60 * 20,
        });
      }
      return result;
    } else {
      return null;
    }
  }
};