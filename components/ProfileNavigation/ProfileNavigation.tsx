"use client";

import Link from "next/link";
import css from "./ProfileNavigation.module.css";

type Props = {
  activeType: string;
};

export default function ProfileNavigation({ activeType }: Props) {
  return (
    <nav className={css.nav}>
      <Link
        href="/profile/own"
        className={`${css.link} ${activeType === "own" ? css.active : ""}`}
      >
        My Recipes
      </Link>
      <Link
        href="/profile/favorites"
        className={`${css.link} ${activeType === "favorites" ? css.active : ""}`}
      >
        Saved Recipes
      </Link>
    </nav>
  );
}
