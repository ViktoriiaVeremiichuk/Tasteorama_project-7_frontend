import * as Yup from "yup";

export const addRecipeSchema = Yup.object({
  title: Yup.string()
    .required("Recipe title is required"),

  description: Yup.string()
    .required("Description is required"),

  time: Yup.number()
    .typeError("Time must be a number")
    .positive("Time must be positive")
    .required("Cooking time is required"),

  calories: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    ),

  category: Yup.string()
    .required("Category is required"),

  instructions: Yup.string()
    .required("Instructions are required"),
});