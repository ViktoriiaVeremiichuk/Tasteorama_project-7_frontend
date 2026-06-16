import { api } from "@/lib/api/api";
import type {
  OwnRecipesResponse,
  Recipe,
  RecipeByIdResponse,
  FavoritesResponse,
} from "@/lib/types/recipe";
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/lib/types/user";

export const register = async (data: RegisterRequest): Promise<AuthUser> => {
  const res = await api.post<AuthUser>("/api/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<AuthUser> => {
  const res = await api.post<AuthUser>("/api/auth/login", data);
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/api/users/current");
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

type GetOwnRecipesArgs = {
  page?: number;
  perPage?: number;
};

export const getOwnRecipes = async ({
  page = 1,
  perPage = 12,
}: GetOwnRecipesArgs = {}): Promise<OwnRecipesResponse> => {
  const res = await api.get<OwnRecipesResponse>("/api/recipes/own", {
    params: { page, perPage },
  });
  return res.data;
};

export const getFavoriteRecipes = async (): Promise<Recipe[]> => {
  const res = await api.get<Recipe[]>("/api/recipes/favorite");
  return res.data;
};

export const getRecipeById = async (
  recipeId: string,
): Promise<RecipeByIdResponse["data"]> => {
  const res = await api.get<RecipeByIdResponse>(`/api/recipes/${recipeId}`);
  return res.data.data;
};

export const deleteOwnRecipe = async (recipeId: string): Promise<Recipe> => {
  const res = await api.delete<Recipe>(`/api/recipes/${recipeId}`);
  return res.data;
};

export const removeFavoriteRecipe = async (
  recipeId: string,
): Promise<FavoritesResponse> => {
  const res = await api.delete<FavoritesResponse>(
    `/api/recipes/favorites/${recipeId}`,
  );
  return res.data;
};
