"use client";

import { use, useEffect, useState } from "react";
import ProfileNavigation from "@/components/ProfileNavigation/ProfileNavigation";
import RecipesList from "@/components/RecipesList/RecipesList";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import { getOwnRecipes, getFavoriteRecipes } from "@/lib/api/recipes";
import type { Recipe } from "@/types/recipe";
import css from "./ProfilePage.module.css";

const LIMIT = 12;

type Props = {
  params: Promise<{
    recipeType: string;
  }>;
};

export default function ProfilePage({ params }: Props) {
  const { recipeType } = use(params);

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

        const result =
          recipeType === "favorites"
            ? await getFavoriteRecipes(page, LIMIT)
            : await getOwnRecipes(page, LIMIT);

        const newRecipes = Array.isArray(result)
          ? result
          : (result.recipes ?? []);

        setRecipes((prev) =>
          page === 1 ? newRecipes : [...prev, ...newRecipes],
        );

        setTotal(
          Array.isArray(result) ? newRecipes.length : (result.totalItems ?? 0),
        );
        setHasMore(Array.isArray(result) ? false : page < result.totalPages);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [recipeType, page]);

  return (
    <main className={css.wrapper}>
      <h1 className={css.title}>My profile</h1>

      <ProfileNavigation activeType={recipeType} />

      <p className={css.count}>{total} recipes</p>

      {error && <p className={css.error}>{error}</p>}
      {!error && recipes.length > 0 && <RecipesList recipes={recipes} />}
      {!error && !isLoading && recipes.length === 0 && (
        <p className={css.empty}>Recipes not found</p>
      )}

      {isLoading && <p className={css.loading}>Loading...</p>}

      {hasMore && !isLoading && (
        <LoadMoreBtn
          onClick={() => setPage((prev) => prev + 1)}
          isLoading={isLoading}
        />
      )}
    </main>
  );
}
