import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./RecipesList.module.css";
import type { Recipe } from "@/lib/types/recipe";

type RecipesListProps = {
  recipes: Recipe[];
};

export default function RecipeList({ recipes }: RecipesListProps) {
  if (!recipes || recipes.length === 0) {
    return <p>Рецептів не знайдено</p>;
  }

  return (
    <div className={styles.recipesList}>
      {recipes.map((recipe: Recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}
