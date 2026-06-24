"use client";

import { useEffect, useState } from "react";
import { getCategories, getIngredients } from "@/lib/api/clientApi";
import type { FilterOption } from "@/types/filter";

type FilterOptionsState = {
  categories: FilterOption[];
  ingredients: FilterOption[];
  isLoading: boolean;
  isLoaded: boolean;
};

let sharedState: FilterOptionsState = {
  categories: [],
  ingredients: [],
  isLoading: false,
  isLoaded: false,
};

let loadPromise: Promise<void> | null = null;
const listeners = new Set<(state: FilterOptionsState) => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener(sharedState));
};

const loadFilterOptions = async () => {
  if (sharedState.isLoaded) {
    return;
  }

  if (loadPromise) {
    await loadPromise;
    return;
  }

  sharedState = {
    ...sharedState,
    isLoading: true,
  };
  notifyListeners();

  loadPromise = (async () => {
    const [categoriesResult, ingredientsResult] = await Promise.allSettled([
      getCategories(),
      getIngredients(),
    ]);

    sharedState = {
      categories:
        categoriesResult.status === "fulfilled" ? categoriesResult.value : [],
      ingredients:
        ingredientsResult.status === "fulfilled" ? ingredientsResult.value : [],
      isLoading: false,
      isLoaded: true,
    };

    if (categoriesResult.status === "rejected") {
      console.error(categoriesResult.reason);
    }

    if (ingredientsResult.status === "rejected") {
      console.error(ingredientsResult.reason);
    }

    notifyListeners();
    loadPromise = null;
  })();

  await loadPromise;
};

export function useFilterOptions() {
  const [state, setState] = useState(sharedState);

  useEffect(() => {
    const listener = (nextState: FilterOptionsState) => {
      setState(nextState);
    };

    listeners.add(listener);
    void loadFilterOptions();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    categories: state.categories,
    ingredients: state.ingredients,
    isLoading: state.isLoading,
  };
}
