export interface Ingredient {
  id: string | { _id: string; name: string };
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

export type RecipeType = "own" | "favorites";

export interface RecipesListProps {
  recipes: Recipe[];
  showFavorite?: boolean;
  assumedFavorite?: boolean;
  onFavoriteRemoved?: (recipeId: string) => void;
  showDelete?: boolean;
  onDeleted?: (recipeId: string) => void;
}
