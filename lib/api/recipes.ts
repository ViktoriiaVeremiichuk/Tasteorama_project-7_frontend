import { api } from "./api";
import type { BackendResponse } from "@/types/backendResponse";
import type { ProfileRecipesResponse } from "@/types/profileRecipesResponse";

export const getRecipes = async (
  page: number,
  limit: number,
): Promise<BackendResponse> => {
  const res = await api.get("/api/recipes", {
    params: { page, limit },
  });
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
    params: { page, limit },
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
  const res = await api.delete(`/api/recipes/${id}`);
  return res.data;
};
