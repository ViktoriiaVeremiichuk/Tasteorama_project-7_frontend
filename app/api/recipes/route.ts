import { NextRequest, NextResponse } from "next/server";
import { api } from "../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import {
  logErrorResponse,
  postMultipartToBackend,
} from "../_utils/utils";
import {
  getCookieHeader,
  refreshSession,
} from "../_utils/authProxy";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const title = request.nextUrl.searchParams.get("title") ?? "";
    const category = request.nextUrl.searchParams.get("category") ?? "";
    const ingredient = request.nextUrl.searchParams.get("ingredient") ?? "";
    const page = Number(request.nextUrl.searchParams.get("page") ?? 1);
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 12);

    const res = await api("/api/recipes/search", {
      params: {
        ...(title !== "" && { title }),
        ...(category !== "" && { category }),
        ...(ingredient !== "" && { ingredient }),
        page,
        limit,
      },
      headers: {
        Cookie: getCookieHeader(cookieStore),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const incomingFormData = await request.formData();

    let cookieHeader = getCookieHeader(cookieStore);
    let result = await postMultipartToBackend(
      "/api/recipes",
      incomingFormData,
      cookieHeader,
    );

    if (result.status === 401) {
      const refreshed = await refreshSession(cookieStore);

      if (refreshed) {
        cookieHeader = getCookieHeader(cookieStore);
        result = await postMultipartToBackend(
          "/api/recipes",
          incomingFormData,
          cookieHeader,
        );
      }
    }

    if (result.status >= 400) {
      logErrorResponse(result.data);
      return NextResponse.json(
        {
          error: `Request failed with status code ${result.status}`,
          response: result.data,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
