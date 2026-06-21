import { getRecipes, searchRecipes } from "@/lib/api/recipes";
import type { BackendResponse } from "@/types/backendResponse";
import type { FilterOption } from "@/types/filter";

const normalize = (value: string) => value.trim().toLowerCase();

export function findExactCategory(
  query: string,
  categories: FilterOption[],
): FilterOption | undefined {
  const normalizedQuery = normalize(query);
  return categories.find(
    (category) => normalize(category.name) === normalizedQuery,
  );
}

export function findExactIngredient(
  query: string,
  ingredients: FilterOption[],
): FilterOption | undefined {
  const normalizedQuery = normalize(query);
  return ingredients.find(
    (ingredient) => normalize(ingredient.name) === normalizedQuery,
  );
}

export function resolveSearchInput(
  query: string,
  currentCategory: string,
  currentIngredient: string,
) {
  return {
    search: query.trim(),
    category: currentCategory,
    ingredients: currentIngredient,
  };
}

export async function fetchRecipesWithPriority(
  search: string,
  category: string,
  ingredient: string,
  page: number,
  limit: number,
  ingredientsList: FilterOption[],
): Promise<BackendResponse> {
  const hasFilters = Boolean(search || category || ingredient);

  if (!hasFilters) {
    return getRecipes(page, limit);
  }

  if (!search.trim()) {
    return searchRecipes(page, limit, { category, ingredient });
  }

  const titleResult = await searchRecipes(page, limit, {
    title: search,
    category,
    ingredient,
  });

  if (titleResult.recipes.length > 0 || page > 1) {
    return titleResult;
  }

  const categoryResult = await searchRecipes(page, limit, {
    category: search,
    ingredient,
  });

  if (categoryResult.recipes.length > 0) {
    return categoryResult;
  }

  const matchedIngredient =
    findExactIngredient(search, ingredientsList) ??
    ingredientsList.find((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );

  if (matchedIngredient) {
    const ingredientResult = await searchRecipes(page, limit, {
      category,
      ingredient: matchedIngredient._id,
    });

    if (ingredientResult.recipes.length > 0) {
      return ingredientResult;
    }
  }

  return titleResult;
}
