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

export type RecipeType = "own" | "favorites";

export interface RecipesListProps {
  recipes: Recipe[];
  showFavorite?: boolean;
  onFavoriteRemoved?: (recipeId: string) => void;
  showDelete?: boolean;
  onDeleted?: (recipeId: string) => void;
}
