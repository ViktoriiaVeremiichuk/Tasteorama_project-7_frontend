import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Recipe } from "@/types/recipe";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  if (!cookieHeader || !API_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/users/current`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function getRecipeById(recipeId: string): Promise<Recipe | null> {
  if (!API_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/recipes/${recipeId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as { data?: Recipe };
    return json.data ?? null;
  } catch {
    return null;
  }
}
