import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

type ParsedSetCookie = {
  Expires?: string;
  Path?: string;
  "Max-Age"?: string;
  sessionId?: string;
  accessToken?: string;
  refreshToken?: string;
};

export function getSessionCookieOptions(parsed: ParsedSetCookie) {
  const maxAgeRaw = parsed["Max-Age"];
  const maxAge = maxAgeRaw ? Number(maxAgeRaw) : undefined;

  return {
    expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
    path: parsed.Path || "/",
    ...(maxAge !== undefined && !Number.isNaN(maxAge) ? { maxAge } : {}),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };
}

export function setSessionCookies(
  cookieStore: ResponseCookies,
  parsed: ParsedSetCookie,
) {
  const options = getSessionCookieOptions(parsed);

  if (parsed.sessionId) {
    cookieStore.set("sessionId", parsed.sessionId, options);
  }
  if (parsed.accessToken) {
    cookieStore.set("accessToken", parsed.accessToken, options);
  }
  if (parsed.refreshToken) {
    cookieStore.set("refreshToken", parsed.refreshToken, options);
  }
}

export function clearSessionCookies(cookieStore: ResponseCookies) {
  const options = { path: "/" };

  cookieStore.delete({ name: "sessionId", ...options });
  cookieStore.delete({ name: "accessToken", ...options });
  cookieStore.delete({ name: "refreshToken", ...options });
}
