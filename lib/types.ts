export interface RecipeIngredient {
  id: string;
  measure: string;
}

export interface AddRecipeFormValues {
  title: string;
  description: string;
  time: number | "";
  calories: number | "";
  category: string;
  instructions: string;
  ingredients: RecipeIngredient[];
  thumb: File | null;
}

export type IngredientItem = {
  key: string;
  id: string;
  name: string;
  measure: string;
}
