import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <p className={styles.text} role="status" aria-live="polite">
      Loading...
    </p>
  );
}
