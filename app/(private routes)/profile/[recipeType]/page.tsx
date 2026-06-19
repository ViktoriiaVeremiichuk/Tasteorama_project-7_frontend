"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import RecipesList from "@/components/RecipesList/RecipesList";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import { getFavoriteRecipes, getOwnRecipes } from "@/lib/api/recipes";
import type { Recipe } from "@/types/recipe";
import mainCss from "../../../page.module.css";
import css from "./ProfilePage.module.css";

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

        const response = Array.isArray(result) ? null : result;
        const newRecipes = Array.isArray(result)
          ? result
          : (result.recipes ?? []);

        setRecipes((prev) =>
          page === 1 ? newRecipes : [...prev, ...newRecipes],
        );
        setTotal(response?.total ?? response?.totalItems ?? newRecipes.length);
        setHasMore(response ? page < (response.totalPages ?? 1) : false);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [recipeType, page]);

  return (
    <main className={`${mainCss.mainContainer} ${css.wrapper}`}>
      <h1 className={css.title}>My profile</h1>

      <p className={css.count}>{total} recipes</p>

      {error && <p className={css.error}>{error}</p>}

      {!error && isLoading && recipes.length === 0 && (
        <p className={css.loading}>Loading...</p>
      )}

      {!error && !isLoading && recipes.length === 0 && (
        <p className={css.empty}>Recipes not found</p>
      )}

      {!error && recipes.length > 0 && <RecipesList recipes={recipes} />}

      {hasMore && !isLoading && (
        <LoadMoreBtn
          onClick={() => setPage((prev) => prev + 1)}
          isLoading={isLoading}
        />
      )}

      {!error && isLoading && recipes.length > 0 && (
        <p className={css.loading}>Loading...</p>
      )}
    </main>
  );
}
