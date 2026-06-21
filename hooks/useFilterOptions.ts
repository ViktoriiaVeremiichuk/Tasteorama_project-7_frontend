"use client";

import { useEffect, useState } from "react";
import { getCategories, getIngredients } from "@/lib/api/clientApi";
import type { FilterOption } from "@/types/filter";

export function useFilterOptions() {
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [ingredients, setIngredients] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesData, ingredientsData] = await Promise.all([
          getCategories(),
          getIngredients(),
        ]);

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
      } catch (error) {
        console.error(error);
        setCategories([]);
        setIngredients([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, []);

  return { categories, ingredients, isLoading };
}
