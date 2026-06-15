import React, { useState }  from "react";
import Link from "next/link";
import style from "./RecipeCard.module.css";

const RecipeCard = (props: any) => {
    const { recipe } = props;

    const id = recipe?.id || recipe?._id;
    const title = recipe?.title || "Назва рецепту";
    const thumb = recipe?.thumb;
    const time = recipe?.time || 0;
    const description = recipe?.description || "";

    const calories = recipe?.calories || "N/A";

    const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite || false);
    const [isHeartLoading, setIsHeartLoading] = useState(false);
    const isAuthorized = true;


     const handleFavoriteClick = async () => {
    if (!isAuthorized) {
      alert("Модальне вікно для неавторизованого користувача");
      return;
    }

     setIsHeartLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); 
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    } finally {
      setIsHeartLoading(false);
    }
  };

 return (
    <div className={style.card}>
      {thumb && (
        <div className={style.imageWrapper}>
          <img src={thumb} alt={title} className={style.image} />
        </div>
      )}

      <div className={style.content}>
        <div className={style.titleRow}>
          <h3 className={style.title}>{title}</h3>
          
          <div className={style.timeCircle}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.375 2.99037V7.92306L10.6635 10.6634M14.5 7.375C14.5 11.31 11.31 14.5 7.375 14.5C3.43997 14.5 0.25 11.31 0.25 7.375C0.25 3.43997 3.43997 0.25 7.375 0.25C11.31 0.25 14.5 3.43997 14.5 7.375Z" stroke="black" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
            <span className={style.timeNumber}>{time}</span>
          </div>
        </div>

        {description && <p className={style.description}>{description}</p>}
        
        <div className={style.metaRow}>
          <span className={style.calories}>~{calories} {calories !== "N/A" ? "cals" : ""}</span>

          <button 
            className={`${style.favoriteBtn} ${isFavorite ? style.activeFavorite : ""}`} 
            onClick={handleFavoriteClick}
            disabled={isHeartLoading}
          >
            {isHeartLoading ? (
              <span className={style.heartLoader}></span>
            ) : (<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.0984 1.90318C16.2296 0.0322748 13.1996 0.0322746 11.3308 1.90318L10 3.23545L8.6692 1.90318C6.80039 0.0322764 3.77043 0.0322756 1.90161 1.90318C0.0327952 3.77408 0.0327954 6.80741 1.90161 8.67831L10 17.4643L18.0984 8.67831C19.9672 6.80741 19.9672 3.77408 18.0984 1.90318Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
</svg>
            )}
          </button>
        </div>

        <div className={style.footer}>
          <Link href={`/recipes/${id}`} className={style.learnMoreLink}>
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;