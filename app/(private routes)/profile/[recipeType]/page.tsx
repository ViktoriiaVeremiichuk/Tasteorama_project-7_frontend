import { notFound } from "next/navigation";
import ProfileNavigation from "@/components/ProfileNavigation/ProfileNavigation";
import ProfileRecipesSection from "@/components/ProfileRecipesSection/ProfileRecipesSection";
import type { RecipeType } from "@/types/recipe";
import styles from "../profile.module.css";

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

  return (
    <section className={styles.profileMain}>
      <header className={styles.profileHeader}>
        <h1 className={styles.profileTitle}>My profile</h1>
        <ProfileNavigation activeType={recipeType} />
      </header>

      <ProfileRecipesSection recipeType={recipeType} />
    </section>
  );
}
