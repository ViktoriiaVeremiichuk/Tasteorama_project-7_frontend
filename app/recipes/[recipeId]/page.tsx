import RecipeDetails from "@/components/RecipeDetails/RecipeDetails";
import NotFoundRecipe from "@/components/NotFoundRecipe/NotFoundRecipe";
import { getRecipeById } from "@/lib/api/recipes";

const RecipeViewPage = async ({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) => {
  const { recipeId } = await params;

  console.log("recipeId =", recipeId);

  let recipe = null;

  try {
    recipe = await getRecipeById(recipeId);
  } catch (error) {
    console.error("getRecipeById error:", error);
    recipe = null;
  }

  if (!recipe) {
    return <NotFoundRecipe />;
  }

  return <RecipeDetails recipe={recipe} />;
};

export default RecipeViewPage;
