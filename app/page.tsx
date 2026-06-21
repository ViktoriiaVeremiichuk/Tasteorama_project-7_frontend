"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchStore } from "@/app/store/searchStore";
import Hero from "@/components/Hero/Hero";
import Loader from "@/components/Loader/Loader";
import LoadMoreBtn from "../components/LoadMoreBtn/LoadMoreBtn";
import RecipesList from "@/components/RecipesList/RecipesList";
import { getRecipes, searchRecipes } from "@/lib/api/recipes";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";


const LIMIT = 12;

export default function MainPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { search, category, ingredients, setTotalRecipes } = useSearchStore();
  const isSearchActive = Boolean(search || category || ingredients);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      setError(null);


  await new Promise((resolve) =>
    setTimeout(resolve, 3000)
  );

      try {
        const result = isSearchActive
          ? await searchRecipes(page, LIMIT, {
              title: search,
              category,
              ingredient: ingredients,
            })
          : await getRecipes(page, LIMIT);

        setTotalRecipes(result.total);

        setRecipes((prev) => {
          const updated =
            page === 1 ? result.recipes : [...prev, ...result.recipes];
          setHasMore(updated.length < result.total);
          return updated;
        });

        if (isSearchActive && page === 1 && result.recipes.length === 0) {
          toast.error(
            search
              ? `No recipes found for "${search}"`
              : "No recipes found",
          );
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [page, search, category, ingredients, isSearchActive, setTotalRecipes]);

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const showRecipesList = !isSearchActive || recipes.length > 0;

  return (
    <>
      <Hero />
      <div className={styles.mainContainer}>
        {error && <p className={styles.error}>{error}</p>}
          <h1 className={styles.title}>Recipes</h1>
        {showRecipesList && !error && <RecipesList recipes={recipes} />}

        {loading ? (
  <Loader />
) : (
  hasMore &&
  recipes.length > 0 && (
    <LoadMoreBtn
      onClick={handleLoadMoreClick}
      isLoading={loading}
    />
  )
)}

       
      </div>
    </>
  );
}
