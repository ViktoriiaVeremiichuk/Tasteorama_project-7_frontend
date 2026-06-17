"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import RecipeCardFavorite from "@/components/RecipeCardFavorite/RecipeCardFavorite";
import { getFavoriteRecipes } from "@/lib/api/clientApi";
import type { Recipe } from "@/lib/types/recipe";
import styles from "./ProfileFavoritesSection.module.css";

export default function ProfileFavoritesSection() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["favorite-recipes"],
    queryFn: getFavoriteRecipes,
  });

  useEffect(() => {
    if (data) {
      setRecipes(data);
    }
  }, [data]);

  function handleRemoved(recipeId: string) {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
  }

  if (isLoading && recipes.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles["loader-wrap"]}>
          <Loader />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <p className={styles.empty}>Failed to load saved recipes.</p>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className={styles.section}>
        <p className={styles.empty}>No saved recipes yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles["favorites-list"]}>
        {recipes.map((recipe) => (
          <RecipeCardFavorite
            key={recipe._id}
            recipe={recipe}
            onRemoved={handleRemoved}
          />
        ))}
      </div>
    </section>
  );
}
