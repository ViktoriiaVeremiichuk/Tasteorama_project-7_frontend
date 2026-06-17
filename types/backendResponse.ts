import type { Recipe } from "@/lib/types/recipe";

export interface BackendResponse {
  recipes: Recipe[];
  total: number;
}
