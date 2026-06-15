import css from './LoadMoreBtn.module.css';

type Props = {
  onClick: () => void;
  isLoading: boolean;
};

const LoadMoreBtn = ({ onClick, isLoading }: Props) => {
  return (
    <button
      type="button"
      className={css.button}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Load more'}
    </button>
  );
};

export default LoadMoreBtn;