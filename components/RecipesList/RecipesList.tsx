import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./RecipesList.module.css";
import type { Recipe, RecipesListProps } from "@/types/recipe";

export default function RecipeList({
  recipes,
  showFavorite = true,
  assumedFavorite = false,
  onFavoriteRemoved,
  showDelete = false,
  onDeleted,
}: RecipesListProps) {
  if (!recipes || recipes.length === 0) {
    return <p>No recipes found</p>;
  }

  return (
    <div className={styles.recipesList}>
      {recipes.map((recipe: Recipe, index: number) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          priority={index === 0}
          showFavorite={showFavorite}
          assumedFavorite={assumedFavorite}
          onFavoriteRemoved={
            onFavoriteRemoved
              ? () => onFavoriteRemoved(recipe._id)
              : undefined
          }
          showDelete={showDelete}
          onDeleted={onDeleted ? () => onDeleted(recipe._id) : undefined}
        />
      ))}
    </div>
  );
}
