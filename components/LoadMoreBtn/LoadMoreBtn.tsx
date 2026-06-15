import styles from "./LoadMoreBtn.module.css";

type LoadMoreBtnProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function LoadMoreBtn({
  onClick,
  disabled = false,
}: LoadMoreBtnProps) {
  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.button}
        onClick={onClick}
        disabled={disabled}
      >
        Load More
      </button>
    </div>
  );
}
