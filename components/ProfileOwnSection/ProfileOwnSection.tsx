"use client";

import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import LoadMoreBtn from "@/components/LoadMoreBtn/LoadMoreBtn";
import Loader from "@/components/Loader/Loader";
import RecipeCardOwn from "@/components/RecipeCardOwn/RecipeCardOwn";
import { getOwnRecipes } from "@/lib/api/clientApi";
import type { OwnRecipesResponse, Recipe } from "@/lib/types/recipe";
import styles from "./ProfileOwnSection.module.css";

const PER_PAGE = 12;

function uniqueRecipes(pages: OwnRecipesResponse[]): Recipe[] {
  const seen = new Set<string>();
  const result: Recipe[] = [];

  for (const page of pages) {
    for (const recipe of page.recipes) {
      if (!seen.has(recipe._id)) {
        seen.add(recipe._id);
        result.push(recipe);
      }
    }
  }

  return result;
}

export default function ProfileOwnSection() {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["own-recipes"],
    queryFn: ({ pageParam }) =>
      getOwnRecipes({ page: pageParam, perPage: PER_PAGE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }

      return undefined;
    },
  });

  const recipes = data ? uniqueRecipes(data.pages) : [];

  function handleDeleted(recipeId: string) {
    queryClient.setQueryData<InfiniteData<OwnRecipesResponse>>(
      ["own-recipes"],
      (old) => {
        if (!old) {
          return old;
        }

        const nextTotalItems = Math.max(
          0,
          (old.pages[0]?.totalItems ?? 0) - 1,
        );
        const nextTotalPages = Math.ceil(nextTotalItems / PER_PAGE);

        return {
          pageParams: old.pageParams,
          pages: old.pages.map((page) => ({
            ...page,
            recipes: page.recipes.filter((recipe) => recipe._id !== recipeId),
            totalItems: nextTotalItems,
            totalPages: nextTotalPages,
          })),
        };
      },
    );

    void refetch();
  }

  function handleLoadMore() {
    void fetchNextPage();
  }

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles["loader-wrap"]}>
          <Loader />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <p className={styles.empty}>Failed to load recipes.</p>
      </section>
    );
  }

  if (recipes.length === 0) {
    if (isFetchingNextPage || isRefetching) {
      return (
        <section className={styles.section}>
          <div className={styles["loader-wrap"]}>
            <Loader />
          </div>
        </section>
      );
    }

    return (
      <section className={styles.section}>
        <p className={styles.empty}>No recipes yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles["own-list"]}>
        {recipes.map((recipe) => (
          <RecipeCardOwn
            key={recipe._id}
            recipe={recipe}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      {hasNextPage ? (
        <div className={styles["load-more-wrap"]}>
          <LoadMoreBtn
            onClick={handleLoadMore}
            disabled={isFetchingNextPage || isRefetching}
            isLoading={isFetchingNextPage}
          />
        </div>
      ) : null}
    </section>
  );
}
