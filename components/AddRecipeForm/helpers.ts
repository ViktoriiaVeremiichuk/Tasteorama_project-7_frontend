import type { AddRecipeFormValues, IngredientItem } from "@/lib/types";

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

  ingredients.forEach((item, index) => {
    formData.append("ingredients[${index}][id]", item.id);
    formData.append("ingredients[${index}][measure]", item.measure);
  });

  if (file) {
    formData.append("thumb", file);
  }

  return formData;
};
