export type RecipeIngredient = {
  id: string | { _id: string; name: string };
  measure: string;
};

export type Recipe = {
  _id: string;
  title: string;
  category: string;
  owner: string;
  area?: string;
  description?: string;
  instructions: string;
  thumb?: string;
  time: number;
  calories?: number;
  ingredients?: RecipeIngredient[];
  createdAt?: string;
  updatedAt?: string;
};

export type OwnRecipesResponse = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  recipes: Recipe[];
};

export type RecipeByIdResponse = {
  data: Recipe;
};

export type FavoritesResponse = {
  favorites: string[];
};

export type RecipeType = "own" | "favorites";
