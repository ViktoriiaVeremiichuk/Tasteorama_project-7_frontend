import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RecipeView from "@/components/RecipeView/RecipeView";
import { getRecipeByIdServer } from "@/lib/api/serverApi";

type RecipeDetailsPageProps = {
  params: Promise<{ recipeId: string }>;
};

export async function generateMetadata({
  params,
}: RecipeDetailsPageProps): Promise<Metadata> {
  const { recipeId } = await params;
  const recipe = await getRecipeByIdServer(recipeId);

  if (!recipe) {
    return {
      title: "Recipe not found | Tasteorama",
    };
  }

  return {
    title: `${recipe.title} | Tasteorama`,
    description:
      recipe.description ?? `View the recipe for ${recipe.title} on Tasteorama.`,
  };
}

export default async function RecipeDetailsPage({
  params,
}: RecipeDetailsPageProps) {
  const { recipeId } = await params;
  const recipe = await getRecipeByIdServer(recipeId);

  if (!recipe) {
    notFound();
  }

  return <RecipeView recipe={recipe} />;
}
