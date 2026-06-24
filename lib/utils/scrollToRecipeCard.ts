export const scrollToRecipeCard = (recipeId: string) => {
  const element = document.getElementById(`recipe-card-${recipeId}`);

  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
};
