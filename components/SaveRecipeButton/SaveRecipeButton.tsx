"use client";

import { useFavoriteRecipe } from "@/hooks/useFavoriteRecipe";

type Props = {
  recipeId: string;
  className?: string;
};

const FavoriteButton = ({ recipeId, className }: Props) => {
  const { isFavorite, toggleFavorite, isPending } = useFavoriteRecipe(recipeId);

  return (
    <button
      type="button"
      className={className}
      onClick={toggleFavorite}
      disabled={isPending}
    >
      {isPending ? "Loading..." : isFavorite ? "Unsave" : "Save"}
    </button>
  );
};

export default FavoriteButton;
