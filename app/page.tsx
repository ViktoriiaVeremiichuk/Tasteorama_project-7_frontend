"use client";

import { useState, useEffect } from "react";
import SearchBox from "../components/SearchBox/SearchBox";
import Filters from "../components/Filters/Filters";
import LoadMoreBtn from "../components/LoadMoreBtn/LoadMoreBtn";
import RecipesList from "@/components/RecipesList/RecipesList";
import type { Recipe } from "@/types/recipe";
import type { BackendResponse } from "@/types/backendResponse";
import styles from "./page.module.css";

const limit = 12;

export default function MainPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${baseUrl}/api/recipes?page=${page}&limit=${limit}`,
        );

        if (!response.ok) {
          throw new Error("Не вдалося завантажити рецепти з сервера");
        }

        const result: BackendResponse = await response.json();

        setRecipes((prev) => {
          const updateRecipesAmount = [...prev, ...result.data];

          if (updateRecipesAmount.length >= result.total) {
            setHasMore(false);
          }
          return updateRecipesAmount;
        });
      } catch (err) {
        console.error(err);
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

      <RecipesList recipes={recipes} />

      {loading && (
        <p style={{ textAlign: "center" }}>Завантаження рецептів...</p>
      )}

      {hasMore && !loading && <LoadMoreBtn onClick={handleLoadMoreClick} />}
    </div>
  );
}
