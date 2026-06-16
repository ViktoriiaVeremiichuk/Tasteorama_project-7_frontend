import type { Recipe } from "@/lib/types/recipe";

export interface BackendResponse {
  data: Recipe[];
  total: number;
}
