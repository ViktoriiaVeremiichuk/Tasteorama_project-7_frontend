import { api } from "./api";
import type { BackendResponse } from "@/types/backendResponse";
import type { OwnRecipesResponse, Recipe } from "@/types/recipe";

export const getRecipes = async (
  page: number,
  limit: number,
): Promise<BackendResponse> => {
  const res = await api.get(`/api/recipes/search?page=${page}&limit=${limit}`);
  return res.data;
};

export const getOwnRecipes = async (
  page: number,
  perPage: number,
): Promise<OwnRecipesResponse> => {
  const res = await api.get<OwnRecipesResponse>("/api/recipes/own", {
    params: { page, perPage },
  });
  return res.data;
};

export const getFavoriteRecipes = async (): Promise<Recipe[]> => {
  const res = await api.get<Recipe[]>("/api/recipes/favorite");
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
