import * as Yup from "yup";

export const FIELD_LIMITS = {
  title: 64,
  description: 200,
  instructions: 1200,
} as const;

const HAS_LETTER = /\p{L}/u;

export const addRecipeSchema = Yup.object({
  title: Yup.string()
    .max(FIELD_LIMITS.title, "Recipe title must be 64 characters or less")
    .matches(HAS_LETTER, {
      message: "Recipe title must contain text, not only numbers",
      excludeEmptyString: true,
    })
    .required("Please enter a recipe title"),

  description: Yup.string()
    .max(FIELD_LIMITS.description, "Description must be 200 characters or less")
    .matches(HAS_LETTER, {
      message: "Description must contain text, not only numbers",
      excludeEmptyString: true,
    })
    .required("Please enter a short description"),

  time: Yup.number()
    .typeError("Cooking time must be a number")
    .min(1, "Cooking time must be at least 1 minute")
    .max(360, "Cooking time must be 360 minutes or less")
    .required("Please enter the cooking time"),

  calories: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .min(1, "Calories must be at least 1")
    .max(10000, "Calories must be 10,000 or less"),

  category: Yup.string()
    .required("Please select a category"),

  instructions: Yup.string()
    .max(
      FIELD_LIMITS.instructions,
      "Instructions must be 1,200 characters or less",
    )
    .matches(HAS_LETTER, {
      message: "Instructions must contain text, not only numbers",
      excludeEmptyString: true,
    })
    .required("Please enter cooking instructions"),
});