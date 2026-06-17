import { api } from "./api";
import type { BackendResponse } from "@/types/backendResponse";

export const getRecipes = async (
  page: number,
  limit: number,
): Promise<BackendResponse> => {
  const res = await api.get(`/api/recipes/search?page=${page}&limit=${limit}`);
  return res.data;
};

export const getOwnRecipes = async (page: number, limit: number) => {
  const res = await api.get(`/api/recipes/own?page=${page}&perPage=${limit}`);
  return res.data;
};

export const getFavoriteRecipes = async (page: number, limit: number) => {
  const res = await api.get(
    `/api/recipes/favorite?page=${page}&perPage=${limit}`,
  );
  return res.data;
};
