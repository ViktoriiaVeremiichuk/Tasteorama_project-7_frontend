"use client";

import ProfileNavigation from "@/components/ProfileNavigation/ProfileNavigation";
import ProfilePageContent from "./ProfilePageContent";
import type { RecipeType } from "@/types/recipe";
import css from "./ProfilePage.module.css";

type ProfilePageClientProps = {
  recipeType: RecipeType;
};

export default function ProfilePageClient({
  recipeType,
}: ProfilePageClientProps) {
  return (
    <main className={css.wrapper}>
      <header className={css.header}>
        <h1 className={css.title}>My profile</h1>
        <ProfileNavigation />
      </header>
      <ProfilePageContent recipeType={recipeType} />
    </main>
  );
}
