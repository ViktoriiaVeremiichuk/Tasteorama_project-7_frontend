export type IngredientItem = {
  id: string;
  name: string;
  measure: string;
};

export const buildRecipeFormData = (
  values: any,
  ingredients: IngredientItem[],
  file: File | null
) => {
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("time", values.time);
  formData.append("category", values.category);
  formData.append("instructions", values.instructions);

  if (values.calories) {
    formData.append("calories", values.calories);
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