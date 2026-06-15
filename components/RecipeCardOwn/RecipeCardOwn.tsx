"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/Loader/Loader";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import { deleteOwnRecipe } from "@/lib/api/clientApi";
import type { Recipe } from "@/lib/types/recipe";
import styles from "./RecipeCardOwn.module.css";

type RecipeCardOwnProps = {
  recipe: Recipe;
  onDeleted: (recipeId: string) => void;
};

export default function RecipeCardOwn({
  recipe,
  onDeleted,
}: RecipeCardOwnProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await deleteOwnRecipe(recipe._id);
      toast.success("Recipe deleted successfully!");
      onDeleted(recipe._id);
    } catch (error) {
      setIsDeleting(false);

      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Failed to delete recipe";
        toast.error(message);
        return;
      }

      toast.error("Failed to delete recipe");
    }
  }

  return (
    <RecipeCard
      recipe={recipe}
      footer={
        isDeleting ? (
          <div className={styles["loader-wrap"]}>
            <Loader />
          </div>
        ) : (
          <div className={styles.actions}>
            <Link
              href={`/recipes/${recipe._id}`}
              className={styles["learn-more"]}
            >
              Learn more
            </Link>
            <button
              type="button"
              className={styles.delete}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        )
      }
    />
  );
}
