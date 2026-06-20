"use client";

import ProfileNavigation from "@/components/ProfileNavigation/ProfileNavigation";
import ProfilePageContent from "./ProfilePageContent";
import type { RecipeType } from "@/types/recipe";
import mainCss from "../../../page.module.css";
import css from "./ProfilePage.module.css";

type ProfilePageClientProps = {
  recipeType: RecipeType;
};

export default function ProfilePageClient({
  recipeType,
}: ProfilePageClientProps) {
  return (
    <main className={`${mainCss.mainContainer} ${css.wrapper}`}>
      <h1 className={css.title}>My profile</h1>
      <ProfileNavigation />
      <ProfilePageContent key={recipeType} recipeType={recipeType} />
    </main>
  );
}
