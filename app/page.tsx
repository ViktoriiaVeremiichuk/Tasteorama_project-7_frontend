"use client";

import { useState, useEffect } from "react";
import SearchBox from "../components/SearchBox/SearchBox";
import Filters from "../components/Filters/Filters";
import LoadMoreBtn from "../components/LoadMoreBtn/LoadMoreBtn";
import RecipesList from "@/components/RecipesList/RecipesList";
import { getRecipes } from "@/lib/api/recipes";
import type { Recipe } from "@/lib/types/recipe";
import styles from "./page.module.css";

const LIMIT = 12;

export default function MainPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getRecipes(page, LIMIT);

        setRecipes((prev) => {
          const updateRecipesAmount =
            page === 1 ? result.recipes : [...prev, ...result.recipes];

          if (updateRecipesAmount.length >= result.total) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          return updateRecipesAmount;
        });
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити рецепти. Спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [page]);

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className={styles.mainContainer}>
      <SearchBox />
      <Filters />

      {error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <RecipesList recipes={recipes} />
      )}

      {loading && (
        <p style={{ textAlign: "center" }}>Завантаження рецептів...</p>
      )}


      {hasMore && !loading && <LoadMoreBtn onClick={handleLoadMoreClick}  isLoading={loading} />}

    </div>
  );
}
