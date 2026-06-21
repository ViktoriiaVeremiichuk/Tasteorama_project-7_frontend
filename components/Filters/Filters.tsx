"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchStore } from "@/app/store/searchStore";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import styles from "./Filters.module.css";
import filterIcon from "./iconFilter/Icon_filter.svg";
import chevronIcon from "./iconFilter/Icon_arrow.svg";

type FiltersProps = {
  recipesCount?: number | null;
  mode?: "search" | "profile";
  onCategoryChange?: (category: string) => void;
  onIngredientChange?: (ingredient: string) => void;
  onReset?: () => void;
  initialCategory?: string;
  initialIngredient?: string;
};

export default function Filters({ 
  recipesCount,
  mode = "search",
  onCategoryChange,
  onIngredientChange,
  onReset,
  initialCategory = "",
  initialIngredient = ""
}: FiltersProps) {
  const {
    search,
    category: searchCategory,
    ingredients: searchIngredients,
    totalRecipes,
    setAllFilters,
    resetFilters,
  } = useSearchStore();

  const [localCategory, setLocalCategory] = useState(initialCategory);
  const [localIngredient, setLocalIngredient] = useState(initialIngredient);

  const { categories, ingredients: ingredientsList } = useFilterOptions();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isProfileMode = mode === "profile";
  const category = isProfileMode ? localCategory : searchCategory;
  const ingredients = isProfileMode ? localIngredient : searchIngredients;

  const resolvedCount =
    recipesCount === null ? null : (recipesCount ?? totalRecipes);
  const hasActiveFilters = Boolean(
    isProfileMode ? (category || ingredients) : (search || category || ingredients)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsPanelOpen(false);
      }
    };

    if (isPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPanelOpen]);

  const handleCategoryChange = (value: string) => {
    if (isProfileMode) {
      setLocalCategory(value);
      onCategoryChange?.(value);
    } else {
      setAllFilters({
        search,
        category: value,
        ingredients,
      });
    }
  };

  const handleIngredientChange = (value: string) => {
    if (isProfileMode) {
      setLocalIngredient(value);
      onIngredientChange?.(value);
    } else {
      setAllFilters({
        search,
        category,
        ingredients: value,
      });
    }
  };

  const handleReset = () => {
    if (isProfileMode) {
      setLocalCategory("");
      setLocalIngredient("");
      onReset?.();
    } else {
      resetFilters();
    }
    setIsPanelOpen(false);
  };

  const handleTogglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  return (
    <section className={styles.section} aria-label="Recipe filters">
      <div className={styles.bar}>
        <p className={styles.count}>
          {resolvedCount === null ? "\u00A0" : `${resolvedCount} recipes`}
        </p>

        <div className={styles.desktopControls}>
          <button
            type="button"
            className={`${styles.resetButton} ${!hasActiveFilters ? styles.resetButtonHidden : ""}`}
            onClick={handleReset}
            disabled={!hasActiveFilters}
            aria-hidden={!hasActiveFilters}
            tabIndex={hasActiveFilters ? 0 : -1}
          >
            Reset filters
          </button>

          <div className={styles.selectWrap}>
            <select
              id="filter-category"
              className={styles.select}
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              aria-label="Category"
            >
              <option value="">Category</option>
              {categories.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <Image
              src={chevronIcon}
              alt=""
              width={16}
              height={16}
              className={styles.selectIcon}
              aria-hidden="true"
            />
          </div>

          <div className={styles.selectWrap}>
            <select
              id="filter-ingredient"
              className={styles.select}
              value={ingredients}
              onChange={(event) => handleIngredientChange(event.target.value)}
              aria-label="Ingredient"
            >
              <option value="">Ingredient</option>
              {ingredientsList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <Image
              src={chevronIcon}
              alt=""
              width={16}
              height={16}
              className={styles.selectIcon}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className={styles.mobileControls} ref={panelRef}>
          <button
            type="button"
            className={styles.filtersButton}
            onClick={handleTogglePanel}
            aria-expanded={isPanelOpen}
            aria-controls="filters-panel"
          >
            Filters
            <Image
              src={filterIcon}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </button>

          {isPanelOpen && (
            <div id="filters-panel" className={styles.panel}>
              <div className={styles.selectWrap}>
                <select
                  id="filter-category-mobile"
                  className={styles.select}
                  value={category}
                  onChange={(event) => {
                    handleCategoryChange(event.target.value);
                  }}
                  aria-label="Category"
                >
                  <option value="">Category</option>
                  {categories.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <Image
                  src={chevronIcon}
                  alt=""
                  width={16}
                  height={16}
                  className={styles.selectIcon}
                  aria-hidden="true"
                />
              </div>

              <div className={styles.selectWrap}>
                <select
                  id="filter-ingredient-mobile"
                  className={styles.select}
                  value={ingredients}
                  onChange={(event) => {
                    handleIngredientChange(event.target.value);
                  }}
                  aria-label="Ingredient"
                >
                  <option value="">Ingredient</option>
                  {ingredientsList.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <Image
                  src={chevronIcon}
                  alt=""
                  width={16}
                  height={16}
                  className={styles.selectIcon}
                  aria-hidden="true"
                />
              </div>

              <button
                type="button"
                className={`${styles.resetButton} ${!hasActiveFilters ? styles.resetButtonHidden : ""}`}
                onClick={handleReset}
                disabled={!hasActiveFilters}
                aria-hidden={!hasActiveFilters}
                tabIndex={hasActiveFilters ? 0 : -1}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
