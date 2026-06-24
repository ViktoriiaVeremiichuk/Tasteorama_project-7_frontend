"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addFavorite, removeFavorite } from "@/lib/api/recipes";
import { useAuthStore } from "@/lib/store/authStore";

type FavoriteAction = "add" | "remove";

type UseFavoriteRecipeOptions = {
  assumedFavorite?: boolean;
};

export const useFavoriteRecipe = (
  recipeId: string,
  onRemoved?: () => void,
  options: UseFavoriteRecipeOptions = {},
) => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const favorites = user?.favorites ?? [];
  const isFavorite =
    options.assumedFavorite === true || favorites.includes(recipeId);

  const mutation = useMutation({
    mutationFn: (action: FavoriteAction) =>
      action === "remove"
        ? removeFavorite(recipeId)
        : addFavorite(recipeId),

    onSuccess: (_data, action) => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        return;
      }

      const currentFavorites = currentUser.favorites ?? [];
      const updatedFavorites =
        action === "remove"
          ? currentFavorites.filter((id) => id !== recipeId)
          : currentFavorites.includes(recipeId)
            ? currentFavorites
            : [...currentFavorites, recipeId];

      setUser({
        ...currentUser,
        favorites: updatedFavorites,
      });

      if (action === "remove" && onRemoved) {
        onRemoved();
      }
    },

    onError: () => {
      toast.error("Error");
    },
  });

  const toggleFavorite = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    mutation.mutate(isFavorite ? "remove" : "add");
  };

  return {
    isFavorite,
    toggleFavorite,
    isPending: mutation.isPending,
  };
};
