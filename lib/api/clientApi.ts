import axios from "axios";
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

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

export const register = async (data: RegisterRequest): Promise<AuthUser> => {
  const res = await api.post<AuthUser>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<AuthUser> => {
  const res = await api.post<AuthUser>("/auth/login", data);
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/users/current");
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

type GetOwnRecipesArgs = {
  page?: number;
  perPage?: number;
};

export const getOwnRecipes = async ({
  page = 1,
  perPage = 12,
}: GetOwnRecipesArgs = {}): Promise<OwnRecipesResponse> => {
  const res = await api.get<OwnRecipesResponse>("/recipes/own", {
    params: { page, perPage },
  });
  return res.data;
};

export const getFavoriteRecipes = async (): Promise<Recipe[]> => {
  const res = await api.get<Recipe[]>("/recipes/favorite");
  return res.data;
};

export const getRecipeById = async (
  recipeId: string,
): Promise<RecipeByIdResponse["data"]> => {
  const res = await api.get<RecipeByIdResponse>(`/recipes/${recipeId}`);
  return res.data.data;
};

export const deleteOwnRecipe = async (recipeId: string): Promise<Recipe> => {
  const res = await api.delete<Recipe>(`/recipes/${recipeId}`);
  return res.data;
};

export const removeFavoriteRecipe = async (
  recipeId: string,
): Promise<FavoritesResponse> => {
  const res = await api.delete<FavoritesResponse>(
    `/recipes/favorites/${recipeId}`,
  );
  return res.data;
};
