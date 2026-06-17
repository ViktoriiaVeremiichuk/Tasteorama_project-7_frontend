import { notFound } from "next/navigation";
import ProfileFavoritesSection from "@/components/ProfileFavoritesSection/ProfileFavoritesSection";
import ProfileNavigation from "@/components/ProfileNavigation/ProfileNavigation";
import ProfileOwnSection from "@/components/ProfileOwnSection/ProfileOwnSection";
import type { RecipeType } from "@/lib/types/recipe";
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
    <section className={styles["profile-main"]}>
      <div className={styles["profile-header"]}>
        <h1 className={styles["profile-title"]}>My profile</h1>
        <ProfileNavigation activeType={recipeType} />
      </div>

      {recipeType === "own" ? (
        <ProfileOwnSection />
      ) : (
        <ProfileFavoritesSection />
      )}
    </section>
  );
}
