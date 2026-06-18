"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteOwnRecipe } from "@/lib/api/recipes";

export const useDeleteOwnRecipe = (
  recipeId: string,
  onDeleted?: (id: string) => void,
) => {
  const mutation = useMutation({
    mutationFn: () => deleteOwnRecipe(recipeId),

    onSuccess: () => {
      onDeleted?.(recipeId);
    },

    onError: () => {
      toast.error("Failed to delete recipe.");
    },
  });

  const deleteRecipe = () => {
    mutation.mutate();
  };

  return {
    deleteRecipe,
    isPending: mutation.isPending,
  };
};
