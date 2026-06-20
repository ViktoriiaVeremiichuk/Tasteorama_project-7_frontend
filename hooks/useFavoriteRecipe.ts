"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addFavorite, removeFavorite } from "@/lib/api/recipes";
import { useAuthStore } from "@/lib/store/authStore";

export const useFavoriteRecipe = (recipeId: string) => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const favorites = user?.favorites ?? [];
  const isFavorite = favorites.includes(recipeId);

  const mutation = useMutation({
    mutationFn: () =>
      isFavorite ? removeFavorite(recipeId) : addFavorite(recipeId),

    onSuccess: () => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return;

      const currentFavorites = currentUser.favorites ?? [];

      const isCurrentlyFavorite = currentFavorites.includes(recipeId);

      const updatedFavorites = isCurrentlyFavorite
        ? currentFavorites.filter((id) => id !== recipeId)
        : [...currentFavorites, recipeId];

      setUser({
        ...currentUser,
        favorites: updatedFavorites,
      });
    },


  });

  const toggleFavorite = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    mutation.mutate();
  };

  return {
    isFavorite,
    toggleFavorite,
    isPending: mutation.isPending,
  };
};
