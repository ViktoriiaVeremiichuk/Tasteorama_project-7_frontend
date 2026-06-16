import { api } from "./api";
import type { BackendResponse } from "@/types/backendResponse";

export const getRecipes = async (page: number, limit: number): Promise<BackendResponse> => {
  const res = await api.get(`/api/recipes?page=${page}&limit=${limit}`);
  return res.data;
};