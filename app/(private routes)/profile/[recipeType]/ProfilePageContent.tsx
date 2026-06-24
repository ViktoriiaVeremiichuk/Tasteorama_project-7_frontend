"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Filters from "@/components/Filters/Filters";
import RecipesList from "@/components/RecipesList/RecipesList";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import { getFavoriteRecipes, getOwnRecipes } from "@/lib/api/recipes";
import type { Recipe, RecipeType } from "@/types/recipe";
import type { ProfileRecipesResponse } from "@/types/profileRecipesResponse";
import Loader from "@/components/Loader/Loader";
import { scrollToRecipeCard } from "@/lib/utils/scrollToRecipeCard";
import css from "./ProfilePage.module.css";

const PAGE_SIZE = 12;
const MAX_API_PAGE_SIZE = 50;

type TabData = {
  recipes: Recipe[];
  visibleCount: number;
  initialized: boolean;
};

const emptyTabData = (): TabData => ({
  recipes: [],
  visibleCount: PAGE_SIZE,
  initialized: false,
});

const dedupeRecipes = (recipes: Recipe[]): Recipe[] => {
  const seen = new Set<string>();

  return recipes.filter((recipe) => {
    if (seen.has(recipe._id)) {
      return false;
    }

    seen.add(recipe._id);
    return true;
  });
};

const resolveTotalCount = (result: ProfileRecipesResponse): number => {
  const raw = result.totalItems ?? result.total ?? result.recipes?.length ?? 0;
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const fetchProfilePage = (
  type: RecipeType,
  pageNum: number,
): Promise<ProfileRecipesResponse> =>
  type === "favorites"
    ? getFavoriteRecipes(pageNum, MAX_API_PAGE_SIZE)
    : getOwnRecipes(pageNum, MAX_API_PAGE_SIZE);

const fetchAllRecipes = async (type: RecipeType): Promise<Recipe[]> => {
  let collected: Recipe[] = [];
  let page = 1;
  let totalCount = Number.POSITIVE_INFINITY;

  while (collected.length < totalCount) {
    const result = await fetchProfilePage(type, page);
    const batch = result.recipes ?? [];
    totalCount = resolveTotalCount(result);

    if (batch.length === 0) {
      break;
    }

    const before = collected.length;
    collected = dedupeRecipes([...collected, ...batch]);

    if (collected.length === before) {
      break;
    }

    if (totalCount > 0 && collected.length >= totalCount) {
      break;
    }

    page += 1;
  }

  return collected;
};

type ProfilePageContentProps = {
  recipeType: RecipeType;
};

export default function ProfilePageContent({
  recipeType,
}: ProfilePageContentProps) {
  const [tabData, setTabData] = useState<Record<RecipeType, TabData>>({
    own: emptyTabData(),
    favorites: emptyTabData(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);
  const tabDataRef = useRef(tabData);
  const pendingScrollIndexRef = useRef<number | null>(null);
  tabDataRef.current = tabData;

  const [category, setCategory] = useState("");
  const [ingredient, setIngredient] = useState("");

  const currentTab = tabData[recipeType];
  const { recipes, visibleCount } = currentTab;
  const total = recipes.length;

  const emptyMessage =
    recipeType === "own" ? "No recipes yet." : "No saved recipes yet.";

  const loadTab = useCallback(async (type: RecipeType) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      setIsLoading(true);
      setError("");

      const allRecipes = await fetchAllRecipes(type);

      if (requestIdRef.current !== requestId) {
        return;
      }

      setTabData((prev) => ({
        ...prev,
        [type]: {
          recipes: allRecipes,
          visibleCount: Math.min(
            Math.max(prev[type].visibleCount, PAGE_SIZE),
            Math.max(allRecipes.length, PAGE_SIZE),
          ),
          initialized: true,
        },
      }));
    } catch {
      if (requestIdRef.current === requestId) {
        setError("Failed to load recipes.");
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setCategory("");
    setIngredient("");
    pendingScrollIndexRef.current = null;
  }, [recipeType]);

  useEffect(() => {
    if (tabDataRef.current[recipeType].initialized) {
      return;
    }

    loadTab(recipeType);
  }, [recipeType, loadTab]);

  const handleLoadMoreClick = () => {
    const current = tabDataRef.current[recipeType];
    pendingScrollIndexRef.current = current.visibleCount;

    setTabData((prev) => {
      const tab = prev[recipeType];

      return {
        ...prev,
        [recipeType]: {
          ...tab,
          visibleCount: Math.min(
            tab.visibleCount + PAGE_SIZE,
            tab.recipes.length,
          ),
        },
      };
    });
  };

  const hasActiveFilters = Boolean(category || ingredient);

  useEffect(() => {
    if (hasActiveFilters) {
      return;
    }

    const scrollIndex = pendingScrollIndexRef.current;

    if (scrollIndex === null) {
      return;
    }

    const recipeId = recipes[scrollIndex]?._id;

    if (!recipeId) {
      return;
    }

    pendingScrollIndexRef.current = null;
    requestAnimationFrame(() => {
      scrollToRecipeCard(recipeId);
    });
  }, [recipes, visibleCount, hasActiveFilters]);

  const removeRecipeFromList = useCallback((recipeId: string) => {
    setTabData((prev) => {
      const current = prev[recipeType];
      const updatedRecipes = current.recipes.filter(
        (recipe) => recipe._id !== recipeId,
      );
      const visibleCount = Math.min(
        current.visibleCount,
        updatedRecipes.length,
      );

      return {
        ...prev,
        [recipeType]: {
          ...current,
          recipes: updatedRecipes,
          visibleCount: Math.max(
            visibleCount,
            Math.min(PAGE_SIZE, updatedRecipes.length),
          ),
        },
      };
    });
  }, [recipeType]);

  const showFavorite = recipeType === "favorites";
  const showDelete = recipeType === "own";
  const showInitialLoader = isLoading && recipes.length === 0;
  const isRefetching = isLoading && recipes.length > 0;

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    if (category) {
      filtered = filtered.filter(
        (recipe) => recipe.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (ingredient) {
      filtered = filtered.filter((recipe) =>
        recipe.ingredients.some((item) =>
          typeof item.id === "string"
            ? item.id === ingredient
            : item.id._id === ingredient,
        ),
      );
    }

    return filtered;
  }, [recipes, category, ingredient]);

  const displayRecipes = hasActiveFilters
    ? filteredRecipes
    : recipes.slice(0, visibleCount);

  const displayCount = hasActiveFilters ? filteredRecipes.length : total;

  const showLoadMore =
    !hasActiveFilters && recipes.length > 0 && visibleCount < recipes.length;

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
        <div className={css.loaderContainer} aria-live="polite">
          <Loader />
        </div>
      )}

      {!error && !isLoading && recipes.length === 0 && (
        <p className={css.empty}>{emptyMessage}</p>
      )}

      {!error &&
        !isLoading &&
        displayRecipes.length === 0 &&
        recipes.length > 0 && (
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
            assumedFavorite={showFavorite}
            onFavoriteRemoved={
              showFavorite ? removeRecipeFromList : undefined
            }
            showDelete={showDelete}
            onDeleted={showDelete ? removeRecipeFromList : undefined}
          />
        </div>
      )}

      {showLoadMore && (
        <div className={css.loadMore}>
          <LoadMoreBtn onClick={handleLoadMoreClick} isLoading={false} />
        </div>
      )}
    </>
  );
}
