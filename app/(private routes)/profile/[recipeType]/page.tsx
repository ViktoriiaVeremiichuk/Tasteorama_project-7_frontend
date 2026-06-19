"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import RecipesList from "@/components/RecipesList/RecipesList";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import { getFavoriteRecipes, getOwnRecipes } from "@/lib/api/recipes";
import type { Recipe } from "@/types/recipe";
import css from "../../../page.module.css";

const LIMIT = 12;

type RecipesResponse = {
  recipes?: Recipe[];
  total?: number;
  totalItems?: number;
  totalPages?: number;
};

export default function ProfilePage() {
  const pathname = usePathname();
  const recipeType = pathname.includes("favorites") ? "favorites" : "own";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result: RecipesResponse | Recipe[] =
          recipeType === "favorites"
            ? await getFavoriteRecipes(page, LIMIT)
            : await getOwnRecipes(page, LIMIT);

        const resultMeta: RecipesResponse = Array.isArray(result) ? {} : result;
        const newRecipes = Array.isArray(result)
          ? result
          : (result.recipes ?? []);

        setRecipes((prev) =>
          page === 1 ? newRecipes : [...prev, ...newRecipes],
        );
        setTotal(resultMeta.total ?? resultMeta.totalItems ?? newRecipes.length);
        setHasMore(page < (resultMeta.totalPages ?? 1));
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [recipeType, page]);

  return (
    <main className={`${css.mainContainer} ${css.profileWrapper}`}>
      <h1 className={css.profileTitle}>My profile</h1>

      <p className={css.profileCount}>{total} recipes</p>

      {error && <p className={css.profileError}>{error}</p>}

      {!error && isLoading && recipes.length === 0 && (
        <p className={css.profileLoading}>Loading...</p>
      )}

      {!error && !isLoading && recipes.length === 0 && (
        <p className={css.profileEmpty}>Recipes not found</p>
      )}

      {!error && recipes.length > 0 && <RecipesList recipes={recipes} />}

      {hasMore && !isLoading && (
        <LoadMoreBtn
          onClick={() => setPage((prev) => prev + 1)}
          isLoading={isLoading}
        />
      )}

      {!error && isLoading && recipes.length > 0 && (
        <p className={css.profileLoading}>Loading...</p>
      )}
    </main>
  );
}
