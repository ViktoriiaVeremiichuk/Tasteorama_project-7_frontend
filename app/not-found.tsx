import styles from "@/components/NotFoundRecipe/NotFoundRecipe.module.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Tasteorama",
  description:
    "The page you are looking for does not exist or may have been moved.",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>

      <h2 className={styles.p}>Page Not Found</h2>

      <p className={styles.p}>
        Sorry, the page you are looking for does not exist or may have been
        moved.
      </p>

      <Link href="/" className={styles.link}>
        Back to Home
      </Link>
    </div>
  );
}
