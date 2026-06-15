import Link from "next/link";
import type { RecipeType } from "@/lib/types/recipe";
import styles from "./ProfileNavigation.module.css";

type ProfileNavigationProps = {
  activeType: RecipeType;
};

const NAV_ITEMS: Array<{ type: RecipeType; label: string; href: string }> = [
  { type: "own", label: "My Recipes", href: "/profile/own" },
  { type: "favorites", label: "Saved Recipes", href: "/profile/favorites" },
];

export default function ProfileNavigation({
  activeType,
}: ProfileNavigationProps) {
  return (
    <nav className={styles.nav} aria-label="Profile navigation">
      <ul className={styles.list}>
        {NAV_ITEMS.map(({ type, label, href }) => (
          <li key={type}>
            <Link
              href={href}
              className={`${styles.link} ${
                activeType === type ? styles["link-active"] : ""
              }`}
              aria-current={activeType === type ? "page" : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
