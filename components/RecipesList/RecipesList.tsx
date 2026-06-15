import React, { useState } from "react";
import style from "./RecipesList.module.css";
import RecipeCard from "../RecipeCard/RecipeCard";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn"; 

const CARDS_PER_PAGE = 12;

const RecipesList = (props: any) => {

  const { recipes = [], loading, error } = props;
  
  const [visibleCount, setVisibleCount] = useState<number>(CARDS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + CARDS_PER_PAGE);
  };

 
  const visibleRecipes = recipes.slice(0, visibleCount);

  if (loading) return <p className={style.message}>Завантаження...</p>;
  if (error) return <p className={style.message}>Помилка: {error} </p>;
  if (recipes.length === 0) return <p className={style.message}>Рецептів не знайдено </p>;

  return (
    <div className={style.wrapper}>
      <div className={style.listContainer}>
        {visibleRecipes.map((recipe: any) => (
          <RecipeCard key={recipe.id || recipe._id} recipe={recipe} />
        ))}
      </div>

      {recipes.length > visibleCount && (
        <LoadMoreBtn onClick={handleLoadMore} />
      )}
    </div>
  );
};

export default RecipesList;
