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
