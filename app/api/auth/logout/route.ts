import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { clearSessionCookies } from "../../_utils/sessionCookies";

export async function POST() {
  try {
    const cookieStore = await cookies();

    await api.post("/api/auth/logout", null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    clearSessionCookies(cookieStore);

    return NextResponse.json({ message: "Logged out" }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}