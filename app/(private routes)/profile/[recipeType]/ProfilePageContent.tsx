"use client";

import { useEffect, useState } from "react";
import RecipesList from "@/components/RecipesList/RecipesList";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import { getFavoriteRecipes, getOwnRecipes } from "@/lib/api/recipes";
import type { Recipe, RecipeType } from "@/types/recipe";
import css from "./ProfilePage.module.css";

const LIMIT = 12;

type ProfilePageContentProps = {
  recipeType: RecipeType;
};

export default function ProfilePageContent({
  recipeType,
}: ProfilePageContentProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const emptyMessage =
    recipeType === "own" ? "No recipes yet." : "No saved recipes yet.";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result =
          recipeType === "favorites"
            ? await getFavoriteRecipes(page, LIMIT)
            : await getOwnRecipes(page, LIMIT);

        const newRecipes = result.recipes;

        setRecipes((prev) =>
          page === 1 ? newRecipes : [...prev, ...newRecipes],
        );
        setTotal(result.total ?? result.totalItems ?? newRecipes.length);
        setHasMore(page < (result.totalPages ?? 1));
      } catch {
        setError("Failed to load recipes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [recipeType, page]);

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <p className={css.count}>{total} recipes</p>

      {error && <p className={css.error}>{error}</p>}

      {!error && isLoading && recipes.length === 0 && (
        <p className={css.loading}>Loading...</p>
      )}

      {!error && !isLoading && recipes.length === 0 && (
        <p className={css.empty}>{emptyMessage}</p>
      )}

      {!error && recipes.length > 0 && <RecipesList recipes={recipes} />}

      {hasMore && !isLoading && (
        <LoadMoreBtn onClick={handleLoadMoreClick} isLoading={isLoading} />
      )}

      {!error && isLoading && recipes.length > 0 && (
        <p className={css.loading}>Loading...</p>
      )}
    </>
  );
}
