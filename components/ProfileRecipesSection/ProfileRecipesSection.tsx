"use client";

import { useEffect, useState } from "react";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
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
  const isOwn = recipeType === "own";
  const [ownRecipes, setOwnRecipes] = useState<Recipe[]>([]);
  const [ownTotal, setOwnTotal] = useState<number>(0);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [favoriteTotal, setFavoriteTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [hasMoreOwn, setHasMoreOwn] = useState<boolean>(true);
  const [hasMoreFavorites, setHasMoreFavorites] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const displayedRecipes = isOwn ? ownRecipes : favoriteRecipes;
  const hasMore = isOwn ? hasMoreOwn : hasMoreFavorites;
  const totalCount = isOwn ? ownTotal : favoriteTotal;

  useEffect(() => {
    if (!isOwn) {
      return;
    }

    const loadOwnRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getOwnRecipes(page, LIMIT);

        setOwnTotal(result.totalItems);
        setOwnRecipes((prev) => {
          const nextRecipes =
            page === 1 ? result.recipes : [...prev, ...result.recipes];

          setHasMoreOwn(page < result.totalPages);
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
  }, [isOwn, page]);

  useEffect(() => {
    if (isOwn) {
      return;
    }

    const loadFavoriteRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getFavoriteRecipes(page, LIMIT);

        setFavoriteTotal(result.totalItems);
        setFavoriteRecipes((prev) => {
          const nextRecipes =
            page === 1 ? result.recipes : [...prev, ...result.recipes];

          setHasMoreFavorites(page < result.totalPages);
          return nextRecipes;
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes.");
        setFavoriteRecipes([]);
        setFavoriteTotal(0);
      } finally {
        setLoading(false);
      }
    };

    void loadFavoriteRecipes();
  }, [isOwn, page]);

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleRecipeDeleted = (id: string) => {
    setOwnRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    setOwnTotal((prev) => Math.max(0, prev - 1));
  };

  if (loading && displayedRecipes.length === 0) {
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

  if (displayedRecipes.length === 0) {
    return (
      <section className={styles.section}>
        <p className={styles.empty}>{EMPTY_MESSAGES[recipeType]}</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <p className={styles.count}>
        {totalCount} {totalCount === 1 ? "recipe" : "recipes"}
      </p>

      <ul className={styles.list}>
        {displayedRecipes.map((recipe) => (
          <li key={recipe._id} className={styles.item}>
            <RecipeCard
              recipe={recipe}
              showFavorite={!isOwn}
              showDelete={isOwn}
              onDeleted={isOwn ? handleRecipeDeleted : undefined}
            />
          </li>
        ))}
      </ul>

      {loading ? <p className={styles.status}>Loading...</p> : null}

      {hasMore && !loading ? (
        <div className={styles.loadMoreWrap}>
          <LoadMoreBtn onClick={handleLoadMoreClick} isLoading={loading} />
        </div>
      ) : null}
    </section>
  );
}
