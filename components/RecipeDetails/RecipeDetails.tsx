"use client";

import { useState, useEffect } from "react";
import type { Recipe } from "@/types/recipe";
import Image from "next/image";
import styles from "./RecipeDetails.module.css";
import SaveRecipeButton from "@/components/SaveRecipeButton/FavoriteButton";

type Props = {
  recipe: Recipe;
};

export default function RecipeDetails({ recipe }: Props) {
  const [imageSrc, setImageSrc] = useState(recipe.thumb);

  useEffect(() => {
    if (window.innerWidth >= 768 && recipe.thumb.includes("/preview/")) {
      const largeImage = recipe.thumb.replace("/preview/", "/preview/large/");
      const handle = window.requestAnimationFrame(() => {
        setImageSrc(largeImage);
      });
      return () => window.cancelAnimationFrame(handle);
    }
  }, [recipe.thumb]);

  return (
    <main>
      <div className={styles.container}>
        {recipe.thumb ? (
          <div className={styles.imageContainer}>
            <Image
              src={imageSrc}
              alt={recipe.title}
              width={704}
              height={624}
              className={styles.image}
              onError={() => setImageSrc(recipe.thumb)}
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
            <SaveRecipeButton recipeId={recipe._id} />
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
