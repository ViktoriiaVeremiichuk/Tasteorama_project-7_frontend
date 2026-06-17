import { api } from "./api";
import type { BackendResponse } from "@/types/backendResponse";
import { Recipe } from "@/types/recipe";

export const getRecipes = async (
  page: number,
  limit: number,
): Promise<BackendResponse> => {
  const res = await api.get(`/api/recipes/search?page=${page}&limit=${limit}`);
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

export const getRecipeById = async (recipeId: string): Promise<Recipe> => {
  const res = await api.get<{ data: Recipe }>(`/api/recipes/${recipeId}`);
  return res.data.data;
};
