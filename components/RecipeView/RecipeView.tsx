import Image from "next/image";
import type { Recipe, RecipeIngredient } from "@/lib/types/recipe";
import styles from "./RecipeView.module.css";

type RecipeViewProps = {
  recipe: Recipe;
};

function getIngredientLabel(ingredient: RecipeIngredient): string {
  const name =
    typeof ingredient.id === "object" ? ingredient.id.name : ingredient.id;

  return `${name} — ${ingredient.measure}`;
}

function getInstructionSteps(instructions: string): string[] {
  return instructions
    .split("\n")
    .map((step) => step.trim())
    .filter(Boolean)
    .map((step) => step.replace(/^\d+\.\s*/, ""));
}

export default function RecipeView({ recipe }: RecipeViewProps) {
  const caloriesLabel =
    recipe.calories && recipe.calories > 0
      ? `~${recipe.calories} cals`
      : "—";
  const instructionSteps = getInstructionSteps(recipe.instructions);

  return (
    <article className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{recipe.title}</h1>
          <ul className={styles.meta}>
            <li className={styles["meta-item"]}>
              <span className={styles.label}>Category:</span> {recipe.category}
            </li>
            {recipe.area ? (
              <li className={styles["meta-item"]}>
                <span className={styles.label}>Area:</span> {recipe.area}
              </li>
            ) : null}
            <li className={styles["meta-item"]}>
              <span className={styles.label}>Time:</span> {recipe.time} min
            </li>
            <li className={styles["meta-item"]}>
              <span className={styles.label}>Calories:</span> {caloriesLabel}
            </li>
          </ul>
        </header>

        {recipe.thumb ? (
          <figure className={styles.figure}>
            <Image
              src={recipe.thumb}
              alt={recipe.title}
              fill
              className={styles.image}
              sizes="(width >= 768px) 864px, 100vw"
              priority
              unoptimized
            />
          </figure>
        ) : null}

        {recipe.description ? (
          <section className={styles.section}>
            <h2 className={styles.heading}>Description</h2>
            <p className={styles.text}>{recipe.description}</p>
          </section>
        ) : null}

        <section className={styles.section}>
          <h2 className={styles.heading}>Ingredients</h2>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul className={styles.list}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`${recipe._id}-ingredient-${index}`}>
                  {getIngredientLabel(ingredient)}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.text}>—</p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Instructions</h2>
          <ol className={styles.steps}>
            {instructionSteps.map((step, index) => (
              <li key={`${recipe._id}-step-${index}`}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
