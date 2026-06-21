"use client";

import { useSearchStore } from "@/app/store/searchStore";
import SearchBox from "@/components/SearchBox/SearchBox";
import styles from "./Hero.module.css";

type HeroProps = {
  onSearch: (value: string) => void;
};

export default function Hero({ onSearch }: HeroProps) {
  const { search } = useSearchStore();

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 id="hero-title" className={styles.title}>
            Plan, Cook, and Share Your Flavors
          </h1>
          <div className={styles.searchWrap}>
            <SearchBox initialValue={search} onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  );
}
