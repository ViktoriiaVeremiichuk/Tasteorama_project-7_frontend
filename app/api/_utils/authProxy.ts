import { parse } from "cookie";
import { isAxiosError } from "axios";
import type { cookies } from "next/headers";
import { api } from "../api";
import { setSessionCookies } from "./sessionCookies";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export function getCookieHeader(cookieStore: CookieStore): string {
  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

function applyRefreshCookies(
  cookieStore: CookieStore,
  setCookieHeader: string | string[] | undefined,
) {
  if (!setCookieHeader) {
    return;
  }

  const cookieArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);
    setSessionCookies(cookieStore, parsed);
  }
}

export async function refreshSession(cookieStore: CookieStore): Promise<boolean> {
  try {
    const apiRes = await api.post("/api/auth/refresh", null, {
      headers: {
        Cookie: getCookieHeader(cookieStore),
      },
    });

    applyRefreshCookies(cookieStore, apiRes.headers["set-cookie"]);
    return true;
  } catch {
    return false;
  }
}

export async function withAuthRetry<T>(
  cookieStore: CookieStore,
  requestFn: (cookieHeader: string) => Promise<T>,
): Promise<T> {
  try {
    return await requestFn(getCookieHeader(cookieStore));
  } catch (error) {
    if (!isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }

    const refreshed = await refreshSession(cookieStore);
    if (!refreshed) {
      throw error;
    }

    return await requestFn(getCookieHeader(cookieStore));
  }
}
