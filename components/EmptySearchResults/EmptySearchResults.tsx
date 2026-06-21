"use client";

import { useSearchStore } from "@/app/store/searchStore";
import styles from "./EmptySearchResults.module.css";

export default function EmptySearchResults() {
  const { resetFilters } = useSearchStore();

  return (
    <section className={styles.section} aria-labelledby="empty-search-title">
      <div className={styles.card}>
        <h2 id="empty-search-title" className={styles.title}>
          We&apos;re sorry! We were not able to find a match.
        </h2>
        <button
          type="button"
          className={styles.resetButton}
          onClick={resetFilters}
        >
          Reset search and filters
        </button>
      </div>
    </section>
  );
}
