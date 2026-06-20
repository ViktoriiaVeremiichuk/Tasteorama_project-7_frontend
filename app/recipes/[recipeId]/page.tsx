import type { Metadata } from "next";
import RecipeDetails from "@/components/RecipeDetails/RecipeDetails";
import NotFoundRecipe from "@/components/NotFoundRecipe/NotFoundRecipe";
import { getRecipeById } from "@/lib/api/recipes";

type Props = {
  params: Promise<{ recipeId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recipeId } = await params;

  try {
    const recipe = await getRecipeById(recipeId);

    return {
      title: recipe.title,
      description: recipe.description ?? `Recipe for ${recipe.title}`,
      openGraph: {
        title: recipe.title,
        description: recipe.description ?? `Recipe for ${recipe.title}`,
        type: "article",
        images: recipe.thumb
          ? [
              {
                url: recipe.thumb,
                width: 1200,
                height: 630,
                alt: recipe.title,
              },
            ]
          : [],
      },
    };
  } catch {
    return {
      title: "Recipe not found",
      description: "Recipe not found",
    };
  }
}

const RecipeViewPage = async ({ params }: Props) => {
  const { recipeId } = await params;

  let recipe = null;

  try {
    recipe = await getRecipeById(recipeId);
  } catch {
    recipe = null;
  }

  if (!recipe) {
    return <NotFoundRecipe />;
  }

  return <RecipeDetails recipe={recipe} />;
};

export default RecipeViewPage;
