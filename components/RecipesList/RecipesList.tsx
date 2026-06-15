import type { ReactNode } from "react";
import styles from "./RecipesList.module.css";

type RecipesListProps = {
  children: ReactNode;
};

export default function RecipesList({ children }: RecipesListProps) {
  return <ul className={styles.list}>{children}</ul>;
}

type RecipesListItemProps = {
  children: ReactNode;
};

export function RecipesListItem({ children }: RecipesListItemProps) {
  return <li className={styles.item}>{children}</li>;
}
