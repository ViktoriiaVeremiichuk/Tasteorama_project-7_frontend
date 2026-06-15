import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api/config";
import type { RecipeByIdResponse } from "@/lib/types/recipe";
import type { User } from "@/lib/types/user";

async function getCookieHeader(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return cookieHeader || null;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieHeader = await getCookieHeader();

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/users/current`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json() as Promise<User>;
}

export async function getRecipeByIdServer(
  recipeId: string,
): Promise<RecipeByIdResponse["data"] | null> {
  const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as RecipeByIdResponse;
  return data.data;
}
