"use client";

import { useEffect, useState } from "react";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import RecipesList from "@/components/RecipesList/RecipesList";
import { getFavoriteRecipes, getOwnRecipes } from "@/lib/api/recipes";
import type { Recipe, RecipeType } from "@/types/recipe";
import styles from "./ProfileRecipesSection.module.css";

const LIMIT = 12;

const EMPTY_MESSAGES: Record<RecipeType, string> = {
  own: "No recipes yet.",
  favorites: "No saved recipes yet.",
};

type ProfileRecipesSectionProps = {
  recipeType: RecipeType;
};

export default function ProfileRecipesSection({
  recipeType,
}: ProfileRecipesSectionProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoritesCache, setFavoritesCache] = useState<Recipe[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
    setRecipes([]);
    setFavoritesCache([]);
    setHasMore(true);
    setError(null);
  }, [recipeType]);

  useEffect(() => {
    if (recipeType !== "own") {
      return;
    }

    const loadOwnRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getOwnRecipes(page, LIMIT);

        setRecipes((prev) => {
          const nextRecipes =
            page === 1 ? result.recipes : [...prev, ...result.recipes];

          setHasMore(page < result.totalPages);
          return nextRecipes;
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    void loadOwnRecipes();
  }, [page, recipeType]);

  useEffect(() => {
    if (recipeType !== "favorites") {
      return;
    }

    const loadFavoriteRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getFavoriteRecipes();
        setFavoritesCache(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes.");
        setFavoritesCache([]);
      } finally {
        setLoading(false);
      }
    };

    void loadFavoriteRecipes();
  }, [recipeType]);

  useEffect(() => {
    if (recipeType !== "favorites") {
      return;
    }

    const visibleRecipes = favoritesCache.slice(0, page * LIMIT);
    setRecipes(visibleRecipes);
    setHasMore(visibleRecipes.length < favoritesCache.length);
  }, [page, favoritesCache, recipeType]);

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading && recipes.length === 0) {
    return (
      <section className={styles.section}>
        <p className={styles.status}>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <p className={styles.error}>{error}</p>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className={styles.section}>
        <p className={styles.empty}>{EMPTY_MESSAGES[recipeType]}</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <RecipesList recipes={recipes} />

      {loading ? <p className={styles.status}>Loading...</p> : null}

      {hasMore && !loading ? (
        <div className={styles.loadMoreWrap}>
          <LoadMoreBtn onClick={handleLoadMoreClick} isLoading={loading} />
        </div>
      ) : null}
    </section>
  );
}
