"use client";

import type { Recipe } from "@/types/recipe";
import Image from "next/image";
import styles from "./RecipeDetails.module.css";
import SaveRecipeButton from "@/components/SaveRecipeButton/SaveRecipeButton";

type Props = {
  recipe: Recipe;
};

export default function RecipeDetails({ recipe }: Props) {
  return (
    <main>
      <div className={styles.container}>
        {recipe.thumb ? (
          <div className={styles.imageContainer}>
            <Image
              key={recipe.thumb}
              src={recipe.thumb}
              alt={recipe.title}
              width={704}
              height={704}
              className={styles.image}
              unoptimized
            />
          </div>
        ) : null}
        <h1 className={styles.title}>{recipe.title}</h1>
        <div className={styles.recipeTextBlock}>
          <div className={styles.generalInfoWrapper}>
            <div className={styles.generalInfo}>
              <h2 className={styles.generalInfoTitle}>General information</h2>
              <p className={styles.generalInfoParagraph}>
                <span className={styles.generalInfoSpan}> Category:</span>{" "}
                {recipe.category}
              </p>
              <p className={styles.generalInfoParagraph}>
                <span className={styles.generalInfoSpan}> Cooking time:</span>{" "}
                {recipe.time} minutes
              </p>
              <p className={styles.generalInfoParagraph}>
                <span className={styles.generalInfoSpan}>
                  {" "}
                  Caloric content:
                </span>{" "}
                {recipe.calories || "-"}
              </p>
            </div>
            <SaveRecipeButton
              className={styles.saveButton}
              recipeId={recipe._id}
            />
          </div>
          <div className={styles.recipeWrapper}>
            <div className={styles.aboutRecipeBlock}>
              <h2 className={styles.aboutRecipeTitle}>About recipe</h2>
              <p className={styles.description}>{recipe.description}</p>
            </div>
            <div className={styles.ingredientsBlock}>
              <h2 className={styles.ingredientsTitle}>Ingredients</h2>
              <ul className={styles.ingredientsList}>
                {recipe.ingredients.map((item) => {
                  const ingredientId = item.id as
                    | string
                    | { name: string; _id: string };
                  const ingredientName =
                    typeof ingredientId === "string"
                      ? ingredientId
                      : ingredientId.name;
                  const key =
                    typeof ingredientId === "string"
                      ? ingredientId
                      : ingredientId._id;

                  return (
                    <li key={key} className={styles.ingredient}>
                      {ingredientName} — {item.measure}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={styles.instructionsBlock}>
              <h2 className={styles.instructionsTitle}>Preparation steps:</h2>
              <div className={styles.instructions}>
                {recipe.instructions.split(/\r?\n/).map((paragraph, index) => (
                  <p key={index} className={styles.instructionsParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
