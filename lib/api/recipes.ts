import { api } from "./api";
import type { BackendResponse } from "@/types/backendResponse";
import type { ProfileRecipesResponse } from "@/types/profileRecipesResponse";

export type RecipeSearchFilters = {
  title?: string;
  category?: string;
  ingredient?: string;
};

export const getRecipes = async (
  page: number,
  limit: number,
): Promise<BackendResponse> => {
  const res = await api.get("/api/recipes", {
    params: { page, limit },
  });

  if (!Array.isArray(res.data?.recipes)) {
    throw new Error(
      typeof res.data?.error === "string" && res.data.error
        ? res.data.error
        : "Failed to load recipes",
    );
  }

  return res.data;
};

export const searchRecipes = async (
  page: number,
  limit: number,
  filters: RecipeSearchFilters = {},
): Promise<BackendResponse> => {
  const params: Record<string, string | number> = { page, limit };

  if (filters.title?.trim()) {
    params.title = filters.title.trim();
  }

  if (filters.category?.trim()) {
    params.category = filters.category.trim();
  }

  if (filters.ingredient?.trim()) {
    params.ingredient = filters.ingredient.trim();
  }

  const res = await api.get<BackendResponse>("/api/recipes", { params });

  if (!Array.isArray(res.data?.recipes)) {
    const payload = res.data as BackendResponse & { error?: string };
    throw new Error(
      typeof payload?.error === "string" && payload.error
        ? payload.error
        : "Failed to search recipes",
    );
  }

  return res.data;
};

export const getOwnRecipes = async (
  page: number,
  limit: number,
): Promise<ProfileRecipesResponse> => {
  const res = await api.get("/api/recipes/own", {
    params: { page, perPage: limit },
  });
  return res.data;
};

export const getFavoriteRecipes = async (
  page: number,
  limit: number,
): Promise<ProfileRecipesResponse> => {
  const res = await api.get("/api/recipes/favorites", {
    params: { page, perPage: limit },
  });
  return res.data;
};

export const addFavorite = async (id: string) => {
  const res = await api.post(`/api/recipes/favorites/${id}`);
  return res.data;
};

export const removeFavorite = async (id: string) => {
  const res = await api.delete(`/api/recipes/favorites/${id}`);
  return res.data;
};

export const deleteOwnRecipe = async (id: string) => {
  const res = await api.delete(`/api/recipes/${id}`, { timeout: 5_000 });
  return res.data;
};
