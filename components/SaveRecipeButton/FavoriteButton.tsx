"use client";

import { useFavoriteRecipe } from "@/hooks/useFavoriteRecipe";
import { Loader } from "lucide-react";
import styles from "./FavoriteButton.module.css";

type Props = {
  recipeId: string;
};

const FavoriteButton = ({ recipeId }: Props) => {
  const { isFavorite, toggleFavorite, isPending } = useFavoriteRecipe(recipeId);

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={isPending}
      className={`${styles.favoriteButton} ${isFavorite ? styles.activefavoriteButton : ""}`}
    >
      {isPending ? (
        <>
          <span>Loading...</span>
          <Loader className={styles.loaderIcon} />
        </>
      ) : (
        <>
          <span>{isFavorite ? "Unsave" : "Save"}</span>
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path
              d="M11.9971 3.25C13.8243 3.25001 15.4342 3.49945 16.4238 3.69727C17.0093 3.81444 17.474 4.2142 17.6455 4.77246C18.0241 6.00512 18.5629 8.41231 18.4941 11.9951C18.4176 15.9795 17.6819 18.5278 17.1748 19.8262C17.0357 20.1823 16.5818 20.2733 16.2744 19.9492C15.6945 19.3376 14.8797 18.5113 14.0986 17.8369C13.7087 17.5003 13.3215 17.1967 12.9727 16.9756C12.6367 16.7627 12.291 16.5957 11.9971 16.5957C11.8444 16.5957 11.679 16.6403 11.5156 16.7041C11.349 16.7691 11.1673 16.8616 10.9775 16.9717C10.598 17.1919 10.1672 17.4951 9.72754 17.832C8.84701 18.5068 7.90927 19.3326 7.24023 19.9434C6.90047 20.2534 6.43076 20.1131 6.32715 19.7207C5.97378 18.3807 5.5 15.863 5.5 12C5.5 8.24709 6.00297 5.9191 6.35742 4.74414C6.52092 4.20221 6.97224 3.81718 7.54395 3.70215C8.53117 3.50352 10.1534 3.25 11.9971 3.25Z"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </>
      )}
    </button>
  );
};

export default FavoriteButton;
