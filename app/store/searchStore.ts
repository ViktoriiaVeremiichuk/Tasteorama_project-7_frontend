import { create } from "zustand";

type FilterParams = {
  search?: string;
  category?: string;
  ingredients?: string;
};

type SearchStore = {
  search: string;
  category: string;
  ingredients: string;
  tempCategory: string;
  tempIngredients: string;
  totalRecipes: number;
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setIngredients: (value: string) => void;
  setTempCategory: (value: string) => void;
  setTempIngredients: (value: string) => void;
  setTotalRecipes: (value: number) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  setAllFilters: (filters: FilterParams) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  search: "",
  category: "",
  ingredients: "",
  tempCategory: "",
  tempIngredients: "",
  totalRecipes: 0,
  setSearch: (value) => set({ search: value }),
  setCategory: (value) => set({ category: value }),
  setIngredients: (value) => set({ ingredients: value }),
  setTempCategory: (value) => set({ tempCategory: value }),
  setTempIngredients: (value) => set({ tempIngredients: value }),
  setTotalRecipes: (value) => set({ totalRecipes: value }),
  applyFilters: () =>
    set((state) => ({
      category: state.tempCategory,
      ingredients: state.tempIngredients,
    })),
  resetFilters: () =>
    set({
      search: "",
      category: "",
      ingredients: "",
      tempCategory: "",
      tempIngredients: "",
    }),
  setAllFilters: (filters) =>
    set({
      search: filters.search ?? "",
      category: filters.category ?? "",
      ingredients: filters.ingredients ?? "",
      tempCategory: filters.category ?? "",
      tempIngredients: filters.ingredients ?? "",
    }),
}));
