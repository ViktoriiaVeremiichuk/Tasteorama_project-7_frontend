import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const hasSession =
      cookieStore.get("accessToken") || cookieStore.get("sessionId");

    if (!hasSession) {
      return NextResponse.json(null, { status: 200 });
    }
    
    const res = await api("/api/users/current", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(null, { status: 200 });
      }
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
