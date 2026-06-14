import React, { useState } from "react";
// import { useSelector } from "react-redux";
import style from "./RecipesList.module.css";
// import RecipeCard from "../RecipeCard/RecipeCard";
// import { selectFavoriteRecipes, selectRecipesLoading, selectRecipesError } from "../../redux/recipes/selectors";


const RecipesList = (props: any) => {

const recipes = props.recipes;
  const loading = props.loading;
  const error = props.error;

  const CARDS_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + CARDS_PER_PAGE);
  };

  const visibleRecipes = recipes ? recipes.slice(0, visibleCount) : [];

        if (loading) return <p className={style.message}>Завантаження... ⏳</p>;
  if (error) return <p className={style.message}>Помилка: {error} ❌</p>;

  if (!recipes || recipes.length === 0) {
    return <p className={style.emptyText}>У вас поки немає улюблених рецептів 🥹</p>;
  }

  
  return (
    <div className={style.wrapper}>
      {/* <ul className={style.container}>
        {visibleRecipes.map((item) => (
          <li key={item._id} className={style.listItem}>
            <RecipeCard recipe={item} />
          </li>
        ))}
      </ul> */}

      {recipes.length > visibleCount && (
        <div className={style.btnWrapper}>
          <button className={style.loadMore} onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipesList;