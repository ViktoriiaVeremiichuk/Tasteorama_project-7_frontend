import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";
import type { RecipeType } from "@/types/recipe";

type ProfilePageProps = {
  params: Promise<{ recipeType: string }>;
};

function isRecipeType(value: string): value is RecipeType {
  return value === "own" || value === "favorites";
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { recipeType } = await params;

  if (!isRecipeType(recipeType)) {
    notFound();
  }

  return <ProfilePageClient recipeType={recipeType} />;
}
