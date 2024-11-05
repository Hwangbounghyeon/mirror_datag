// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { refreshToken } from "@/app/actions/auth";

export async function POST(request: NextRequest) {
  try {
    const newToken = await refreshToken();
    if (!newToken) {
      return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
    }
    return NextResponse.json({ status: 200, access_token: newToken });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
