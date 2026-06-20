import Image from "next/image";
import Link from "next/link";
import styles from "./NotFoundRecipe.module.css";

export default function NotFoundRecipe() {
  return (
    <main>
      <div className={styles.container}>
        <Image
          src="/not-found.jpg"
          alt="Not Found Recipe"
          width={600}
          height={438}
          className={styles.image}
        />
        <h1 className={styles.title}>404</h1>
        <p className={styles.p}>Recipe not found</p>
        <Link href="/" className={styles.link}>
          <Image
            src="/arrow.svg"
            className={styles.icon}
            alt="arrow"
            width={24}
            height={24}
          />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
