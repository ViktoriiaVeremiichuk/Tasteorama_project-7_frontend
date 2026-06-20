"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProfileNavigation from "@/components/ProfileNavigation/ProfileNavigation";
import RecipesList from "@/components/RecipesList/RecipesList";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import { getFavoriteRecipes, getOwnRecipes } from "@/lib/api/recipes";
import type { Recipe } from "@/types/recipe";
import mainCss from "../../../page.module.css";
import css from "./ProfilePage.module.css";

const LIMIT = 12;

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

      <ProfileNavigation />

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
