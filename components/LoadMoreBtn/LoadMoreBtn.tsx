import css from "./LoadMoreBtn.module.css";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const LoadMoreBtn = ({
  onClick,
  disabled = false,
  isLoading = false,
}: Props) => {
  const isDisabled = disabled || isLoading;

  return (
    <div className={css.wrap}>
      <button
        type="button"
        className={css.button}
        onClick={onClick}
        disabled={isDisabled}
      >
        {isLoading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};

export default LoadMoreBtn;
