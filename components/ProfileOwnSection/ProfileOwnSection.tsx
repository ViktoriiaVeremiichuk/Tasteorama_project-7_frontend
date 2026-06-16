"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import Loader from "@/components/Loader/Loader";
import RecipeCardOwn from "@/components/RecipeCardOwn/RecipeCardOwn";
import listStyles from "@/components/RecipesList/RecipesList.module.css";
import { getOwnRecipes } from "@/lib/api/clientApi";
import type { Recipe } from "@/lib/types/recipe";
import styles from "./ProfileOwnSection.module.css";

function mergeRecipes(prev: Recipe[], incoming: Recipe[]): Recipe[] {
  const seen = new Set(prev.map((recipe) => recipe._id));
  const uniqueIncoming = incoming.filter((recipe) => !seen.has(recipe._id));
  return [...prev, ...uniqueIncoming];
}

export default function ProfileOwnSection() {
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["own-recipes", page],
    queryFn: () => getOwnRecipes({ page, perPage: 12 }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (!data || data.page !== page) {
      return;
    }

    setTotalPages(data.totalPages);
    setRecipes((prev) =>
      page === 1 ? data.recipes : mergeRecipes(prev, data.recipes),
    );
  }, [data, page]);

  function handleLoadMore() {
    setPage((prev) => prev + 1);
  }

  function handleDeleted(recipeId: string) {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
  }

  if (isLoading && recipes.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles["loader-wrap"]}>
          <Loader />
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className={styles.section}>
        <p className={styles.empty}>No recipes yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={listStyles.recipesList}>
        {recipes.map((recipe) => (
          <RecipeCardOwn
            key={recipe._id}
            recipe={recipe}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      {page < totalPages ? (
        <LoadMoreBtn onClick={handleLoadMore} disabled={isFetching} />
      ) : null}
    </section>
  );
}
