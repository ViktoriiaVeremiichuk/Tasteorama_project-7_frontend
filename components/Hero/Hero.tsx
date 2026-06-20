"use client";

import { useState, useCallback } from "react";
import { useSearchStore } from "@/app/store/searchStore";
import FeaturedRecipe from "@/components/FeaturedRecipe/FeaturedRecipe";
import SearchBox from "@/components/SearchBox/SearchBox";
import {Filters} from "@/components/Filters/Filters";
import styles from "./Hero.module.css";

export default function Hero() {
  const [featured, setFeatured] = useState<Recipe | null>(null);
  const { setSearch } = useSearchStore();

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <h1 className={styles.title}>Plan, Cook, and Share Your Flavors</h1>
            <div className={styles.searchWrap}>
              <SearchBox onSearch={(value) => setSearch(value)}/>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <Filters />
      </section>

      {featured && (
        <section aria-label="Featured recipe">
          <FeaturedRecipe recipe={featured} />
        </section>
      )}
    </>
  );
}
