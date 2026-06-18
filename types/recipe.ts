export interface Ingredient {
  id: string;
  measure: string;
}

export interface Recipe {
  _id: string;
  title: string;
  thumb: string;
  description: string;
  category: string;
  instructions: string;
  time: string;
  calories?: number;
  ingredients: Ingredient[];
}

export interface RecipesListProps {
  recipes: Recipe[];
}

export type RecipeType = "own" | "favorites";

export interface OwnRecipesResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  recipes: Recipe[];
}

export interface FavoriteRecipesResponse {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  recipes: Recipe[];
}
