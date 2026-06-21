"use client";

import { useEffect, useRef, useState } from "react";
import Filters from "@/components/Filters/Filters";
import RecipesList from "@/components/RecipesList/RecipesList";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import { getFavoriteRecipes, getOwnRecipes } from "@/lib/api/recipes";
import type { Recipe, RecipeType } from "@/types/recipe";
import css from "./ProfilePage.module.css";

const LIMIT = 12;

type TabData = {
  recipes: Recipe[];
  total: number;
  hasMore: boolean;
  page: number;
};

const emptyTabData = (): TabData => ({
  recipes: [],
  total: 0,
  hasMore: false,
  page: 1,
});

const profileTabCache: Record<RecipeType, TabData> = {
  own: emptyTabData(),
  favorites: emptyTabData(),
};

type ProfilePageContentProps = {
  recipeType: RecipeType;
};

export default function ProfilePageContent({
  recipeType,
}: ProfilePageContentProps) {
  const [tabData, setTabData] = useState<Record<RecipeType, TabData>>(() => ({
    own: { ...profileTabCache.own, recipes: [...profileTabCache.own.recipes] },
    favorites: {
      ...profileTabCache.favorites,
      recipes: [...profileTabCache.favorites.recipes],
    },
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);
  
  const [category, setCategory] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  const currentTab = tabData[recipeType];
  const { recipes, total, hasMore, page } = currentTab;

  const emptyMessage =
    recipeType === "own" ? "No recipes yet." : "No saved recipes yet.";

  // Reset filters when tab changes
  useEffect(() => {
    setCategory("");
    setIngredient("");
  }, [recipeType]);

  // Apply client-side filtering
  useEffect(() => {
    let filtered = [...recipes];

    if (category) {
      filtered = filtered.filter(recipe => 
        recipe.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (ingredient) {
      filtered = filtered.filter(recipe =>
        recipe.ingredients.some(item => {
          const ingredientId = typeof item.id === 'string' ? item.id : item.id._id;
          return ingredientId === ingredient;
        })
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, category, ingredient]);

  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result =
          recipeType === "favorites"
            ? await getFavoriteRecipes(page, LIMIT)
            : await getOwnRecipes(page, LIMIT);

        if (requestIdRef.current !== requestId) {
          return;
        }

        const newRecipes = result.recipes;
        const totalCount =
          result.total ?? result.totalItems ?? newRecipes.length;

        setTabData((prev) => {
          const previousTab = prev[recipeType];
          const updatedRecipes =
            page === 1
              ? newRecipes
              : [...previousTab.recipes, ...newRecipes];

          const nextTabData = {
            recipes: updatedRecipes,
            total: totalCount,
            hasMore: updatedRecipes.length < totalCount,
            page,
          };

          profileTabCache[recipeType] = {
            ...nextTabData,
            recipes: [...updatedRecipes],
          };

          return {
            ...prev,
            [recipeType]: nextTabData,
          };
        });
      } catch {
        if (requestIdRef.current === requestId) {
          setError("Failed to load recipes.");
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    fetchRecipes();
  }, [recipeType, page]);

  const handleLoadMoreClick = () => {
    setTabData((prev) => {
      const nextPage = prev[recipeType].page + 1;

      profileTabCache[recipeType] = {
        ...profileTabCache[recipeType],
        page: nextPage,
      };

      return {
        ...prev,
        [recipeType]: {
          ...prev[recipeType],
          page: nextPage,
        },
      };
    });
  };

  const handleFavoriteRemoved = (recipeId: string) => {
    setTabData((prev) => {
      const current = prev[recipeType];
      const updatedRecipes = current.recipes.filter(
        (recipe) => recipe._id !== recipeId,
      );
      const updatedTotal = Math.max(0, current.total - 1);
      const nextTabData = {
        ...current,
        recipes: updatedRecipes,
        total: updatedTotal,
        hasMore: updatedRecipes.length < updatedTotal,
      };

      profileTabCache[recipeType] = {
        ...nextTabData,
        recipes: [...updatedRecipes],
      };

      return {
        ...prev,
        [recipeType]: nextTabData,
      };
    });
  };

  const handleRecipeDeleted = (recipeId: string) => {
    setTabData((prev) => {
      const current = prev[recipeType];
      const updatedRecipes = current.recipes.filter(
        (recipe) => recipe._id !== recipeId,
      );
      const updatedTotal = Math.max(0, current.total - 1);
      const nextTabData = {
        ...current,
        recipes: updatedRecipes,
        total: updatedTotal,
        hasMore: updatedRecipes.length < updatedTotal,
      };

      profileTabCache[recipeType] = {
        ...nextTabData,
        recipes: [...updatedRecipes],
      };

      return {
        ...prev,
        [recipeType]: nextTabData,
      };
    });
  };

  const showFavorite = recipeType === "favorites";
  const showDelete = recipeType === "own";
  const showInitialLoader = isLoading && recipes.length === 0;
  const isRefetching = isLoading && recipes.length > 0 && page === 1;
  
  const displayCount = (category || ingredient) ? filteredRecipes.length : total;
  const displayRecipes = (category || ingredient) ? filteredRecipes : recipes;

  return (
    <>
      <Filters 
        recipesCount={displayCount}
        mode="profile"
        onCategoryChange={setCategory}
        onIngredientChange={setIngredient}
        onReset={() => {
          setCategory("");
          setIngredient("");
        }}
        initialCategory={category}
        initialIngredient={ingredient}
      />

      {error && <p className={css.error}>{error}</p>}

      {showInitialLoader && (
        <p className={css.loading} aria-live="polite">
          Loading...
        </p>
      )}

      {!error && !isLoading && recipes.length === 0 && (
        <p className={css.empty}>{emptyMessage}</p>
      )}

      {!error && !isLoading && displayRecipes.length === 0 && recipes.length > 0 && (
        <p className={css.empty}>No recipes match the selected filters.</p>
      )}

      {!error && displayRecipes.length > 0 && (
        <div
          className={isRefetching ? css.listRefetching : undefined}
          aria-busy={isRefetching}
        >
          <RecipesList
            recipes={displayRecipes}
            showFavorite={showFavorite}
            onFavoriteRemoved={
              showFavorite ? handleFavoriteRemoved : undefined
            }
            showDelete={showDelete}
            onDeleted={showDelete ? handleRecipeDeleted : undefined}
          />
        </div>
      )}

      {hasMore && recipes.length > 0 && (
        <div className={css.loadMore}>
          <LoadMoreBtn
            onClick={handleLoadMoreClick}
            isLoading={isLoading && page > 1}
          />
        </div>
      )}
    </>
  );
}
