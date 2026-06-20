import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./RecipesList.module.css";
import type { Recipe, RecipesListProps } from "@/types/recipe";

export default function RecipeList({
  recipes,
  showFavorite = true,
  onFavoriteRemoved,
  showDelete = false,
  onDeleted,
}: RecipesListProps) {
  if (!recipes || recipes.length === 0) {
    return <p>Рецептів не знайдено</p>;
  }

  return (
    <div className={styles.recipesList}>
      {recipes.map((recipe: Recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          showFavorite={showFavorite}
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
