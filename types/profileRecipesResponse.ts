import type { Recipe } from "./recipe";

export interface ProfileRecipesResponse {
  recipes: Recipe[];
  total?: number;
  totalItems?: number;
  totalPages?: number;
}
