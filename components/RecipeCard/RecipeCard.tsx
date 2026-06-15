import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Recipe } from "@/lib/types/recipe";
import styles from "./RecipeCard.module.css";

type RecipeCardProps = {
  recipe: Recipe;
  footer?: ReactNode;
};

export default function RecipeCard({ recipe, footer }: RecipeCardProps) {
  const caloriesLabel =
    recipe.calories && recipe.calories > 0
      ? `~${recipe.calories} cals`
      : "—";

  return (
    <article className={styles.card}>
      <div className={styles["image-wrap"]}>
        {recipe.thumb ? (
          <Image
            src={recipe.thumb}
            alt={recipe.title}
            fill
            className={styles.image}
            sizes="(width >= 1440px) 288px, 100vw"
            unoptimized
          />
        ) : (
          <div className={styles["image-placeholder"]} />
        )}
      </div>

      <div className={styles.body}>
        <div className={styles["title-row"]}>
          <h2 className={styles.title}>{recipe.title}</h2>
          <div className={styles["time-badge"]}>
            <svg
              className={styles["time-icon"]}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 7v5l3 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className={styles["time-value"]}>{recipe.time}</span>
          </div>
        </div>

        <div className={styles.meta}>
          {recipe.description ? (
            <p className={styles.description}>{recipe.description}</p>
          ) : null}
          <p className={styles.calories}>{caloriesLabel}</p>
        </div>

        {footer ?? (
          <Link href={`/recipes/${recipe._id}`} className={styles["learn-more"]}>
            Learn more
          </Link>
        )}
      </div>
    </article>
  );
}
