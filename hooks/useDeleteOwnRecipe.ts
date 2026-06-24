"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { deleteOwnRecipe } from "@/lib/api/recipes";

const OFFLINE_ERROR_MESSAGE =
  "No internet connection. Failed to delete recipe.";
const DELETE_ERROR_MESSAGE = "Failed to delete recipe.";

export const useDeleteOwnRecipe = (
  recipeId: string,
  onDeleted?: (id: string) => void,
) => {
  const mutation = useMutation({
    mutationFn: () => deleteOwnRecipe(recipeId),
    retry: false,

    onSuccess: () => {
      onDeleted?.(recipeId);
    },

    onError: (error) => {
      const message =
        isAxiosError(error) && !error.response
          ? OFFLINE_ERROR_MESSAGE
          : DELETE_ERROR_MESSAGE;

      toast.error(message);
    },
  });

  const deleteRecipe = () => {
    if (mutation.isPending) {
      return;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast.error(OFFLINE_ERROR_MESSAGE);
      return;
    }

    mutation.mutate();
  };

  return {
    deleteRecipe,
    isPending: mutation.isPending,
  };
};
