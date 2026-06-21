"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchStore } from "@/app/store/searchStore";
import Hero from "@/components/Hero/Hero";
import Filters from "@/components/Filters/Filters";
import EmptySearchResults from "@/components/EmptySearchResults/EmptySearchResults";
import LoadMoreBtn from "../components/LoadMoreBtn/LoadMoreBtn";
import RecipesList from "@/components/RecipesList/RecipesList";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import {
  fetchRecipesWithPriority,
  resolveSearchInput,
} from "@/lib/search/searchFlow";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

const LIMIT = 12;

export default function MainPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    search,
    category,
    ingredients,
    totalRecipes,
    setAllFilters,
    setTotalRecipes,
  } = useSearchStore();

  const { ingredients: ingredientsList } = useFilterOptions();
  const isSearchActive = Boolean(search || category || ingredients);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      setAllFilters(
        resolveSearchInput(query, category, ingredients),
      );
    },
    [category, ingredients, setAllFilters],
  );

  useEffect(() => {
    setPage(1);
  }, [search, category, ingredients]);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchRecipesWithPriority(
          search,
          category,
          ingredients,
          page,
          LIMIT,
          ingredientsList,
        );

        setTotalRecipes(result.total);

        setRecipes((prev) => {
          const updated =
            page === 1 ? result.recipes : [...prev, ...result.recipes];
          setHasMore(updated.length < result.total);
          return updated;
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [
    page,
    search,
    category,
    ingredients,
    ingredientsList,
    setTotalRecipes,
  ]);

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const showEmptyState =
    isSearchActive && !loading && !error && recipes.length === 0;
  const showRecipesList = !error && recipes.length > 0;
  const showInitialLoader = loading && recipes.length === 0;
  const isRefetching = loading && recipes.length > 0 && page === 1;

  return (
    <>
      <Hero onSearch={handleSearchSubmit} />
      <div className={styles.mainContainer}>
        <div
          className={`${styles.resultsHeaderSlot} ${search ? styles.resultsHeaderSlotActive : ""}`}
        >
          {search && (
            <h2 className={styles.resultsHeader}>
              Search Results for &ldquo;{search}&rdquo;
            </h2>
          )}
        </div>

        <h2 className={styles.recipesTitle}>Recipes</h2>

        <Filters
          recipesCount={
            loading && recipes.length === 0 ? null : totalRecipes
          }
        />

        {error && <p className={styles.error}>{error}</p>}

        {showInitialLoader && (
          <p className={styles.loader} aria-live="polite">
            Loading...
          </p>
        )}

        {showEmptyState && <EmptySearchResults />}

        {showRecipesList && (
          <div
            className={isRefetching ? styles.listRefetching : undefined}
            aria-busy={isRefetching}
          >
            
            <RecipesList recipes={recipes} />
          </div>
        )}

        {hasMore && recipes.length > 0 && (
          <LoadMoreBtn
            onClick={handleLoadMoreClick}
            isLoading={loading && page > 1}
          />
        )}
      </div>
    </>
  );
}
