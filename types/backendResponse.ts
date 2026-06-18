import type { Recipe } from "./recipe";

export interface BackendResponse {
  recipes: Recipe[];
  total: number;
}
