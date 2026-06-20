'use client';

import { useState, useEffect } from 'react';
import { useSearchStore } from "@/app/store/searchStore";
import css from './Filters.module.css';
import { getCategories, getIngredients } from '@/lib/api/api';
  
export default function Filters() {
   const {   
    search,
    category,
    ingredients,
    totalRecipes,
    setCategory,
    setIngredients,
    resetFilters 
  } = useSearchStore();
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [ingredientsList, setIngredientsList] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categories, ingredients] = await Promise.all([
          getCategories(),
          getIngredients(),
        ]);

        setCategoriesList(categories);
        setIngredientsList(ingredients);
      } catch (error) {
        console.error("Failed to fetch dynamic filter options from Tasteorama API:", error);
      }
    }

     fetchFilterOptions();
  }, []);

   const hasActiveFilters = Boolean(search || category || ingredients);

  return (
    <div className={css.mainContainer}>
      <h2 className={css.title}>Recipes</h2>
      <div className={css.filterContainer}>
        <p className={css.dropdownSearch}>{ totalRecipes } recipes</p>
        <div className={css.dropdownBtn}>
          
          <button
            className={css.open}
            type="button">
            Filters           
          </button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.68117 5.625L17.3188 5.62501C18.1092 5.62501 18.75 6.26576 18.75 7.05617C18.75 7.42149 18.6103 7.77298 18.3595 8.03863L13.5577 13.125L13.5577 17.5336C13.5577 18.2705 12.7878 18.7543 12.1239 18.4346L11.0085 17.8976C10.6624 17.731 10.4423 17.3808 10.4423 16.9966L10.4423 13.125L5.64049 8.03863C5.3897 7.77298 5.25 7.42149 5.25 7.05617C5.25 6.26576 5.89076 5.625 6.68117 5.625Z" stroke="black" stroke-width="0.5" />
          </svg>
        </div>
        <div className={css.dropdown}>
          { hasActiveFilters && (
          <button
            type="button"
            className={css.resetButton}
          >
            Reset filters
          </button>
          )}
            <select
             value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={css.select}
        >
                <option value="">Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
              </select>
               <select
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className={css.select}
        >
          <option value="">Ingredients</option>
          {ingredientsList.map((ing) => (
            <option key={ing.id} value={ing.id}>{ing.name}</option>
          ))}
        </select>
        </div>
      </div>
    </div>
  );
}