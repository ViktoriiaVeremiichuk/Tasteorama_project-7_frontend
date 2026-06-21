import * as Yup from "yup";

export const addRecipeSchema = Yup.object({
  title: Yup.string()
    .max(64, "Maximum 64 characters")
    .required("Recipe title is required"),

  description: Yup.string()
    .max(200, "Maximum 200 characters")
    .required("Description is required"),

  time: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Time must be a number")
    .min(1, "Minimum 1 minute")
    .max(360, "Maximum 360 minutes")
    .required("Cooking time is required"),

  calories: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .min(1, "Minimum 1 calorie")
    .max(10000, "Maximum 10000 calories"),

  category: Yup.string()
    .required("Category is required"),

  instructions: Yup.string()
    .required("Instructions are required"),
});