import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>Tasteorama</div>

        <p className={styles.copyright}>
          © 2025 Tasteorama. All rights reserved.
        </p>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Recipes
          </Link>

          <Link href="/profile" className={styles.link}>
            Account
          </Link>
        </nav>
      </div>
    </footer>
  );
}
