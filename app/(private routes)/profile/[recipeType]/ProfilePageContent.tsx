"use client";

import { useEffect, useState } from "react";
import Filters from "@/components/Filters/Filters";
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
        const totalCount = result.total ?? result.totalItems ?? newRecipes.length;

        setRecipes((prev) => {
          const updatedRecipes =
            page === 1 ? newRecipes : [...prev, ...newRecipes];

          setTotal(totalCount);
          setHasMore(updatedRecipes.length < totalCount);

          return updatedRecipes;
        });
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

  const handleFavoriteRemoved = (recipeId: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
    setTotal((prev) => Math.max(0, prev - 1));
  };

  const handleRecipeDeleted = (recipeId: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
    setTotal((prev) => Math.max(0, prev - 1));
  };

  const showFavorite = recipeType === "favorites";
  const showDelete = recipeType === "own";

  return (
    <>
      <p className={css.count}>{total} recipes</p>

      <div className={css.filters}>
        <Filters />
      </div>

      {error && <p className={css.error}>{error}</p>}

      {!error && isLoading && recipes.length === 0 && (
        <p className={css.loading}>Loading...</p>
      )}

      {!error && !isLoading && recipes.length === 0 && (
        <p className={css.empty}>{emptyMessage}</p>
      )}

      {!error && recipes.length > 0 && (
        <RecipesList
          recipes={recipes}
          showFavorite={showFavorite}
          onFavoriteRemoved={
            showFavorite ? handleFavoriteRemoved : undefined
          }
          showDelete={showDelete}
          onDeleted={showDelete ? handleRecipeDeleted : undefined}
        />
      )}

      {hasMore && !isLoading && (
        <div className={css.loadMore}>
          <LoadMoreBtn onClick={handleLoadMoreClick} isLoading={isLoading} />
        </div>
      )}

      {!error && isLoading && recipes.length > 0 && (
        <p className={css.loading}>Loading...</p>
      )}
    </>
  );
}
