import type { AddRecipeFormValues } from "@/lib/types";
import { IngredientItem } from "./AddRecipeForm";

type RecipeFormFields = {
  title: string;
  description: string;
  time: string | number;
  calories: string | number;
  category: string;
  instructions: string;
};

export const buildRecipeFormData = (
  values: RecipeFormFields,
  ingredients: IngredientItem[],
  file: File | null
) => {
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("time", String(values.time));
  formData.append("category", values.category);
  formData.append("instructions", values.instructions);

  if (values.calories) {
    formData.append("calories", String(values.calories));
  }

  formData.append(
    "ingredients",
    JSON.stringify(
      ingredients.map(({ id, measure }) => ({
        id,
        measure,
      }))
    )
  );

  if (file) {
    formData.append("thumb", file);
  }

  return formData;
};
