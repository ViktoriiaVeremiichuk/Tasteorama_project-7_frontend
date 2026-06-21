"use client";

import { useEffect, useState } from "react";
import styles from "./SearchBox.module.css";

type SearchBoxProps = {
  onSearch: (value: string) => void;
  initialValue?: string;
};

const SEARCH_MIN_LENGTH = 3;

export default function SearchBox({
  onSearch,
  initialValue = "",
}: SearchBoxProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [error, setError] = useState("");

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const validateSearch = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Please enter a recipe name.");
      return false;
    }

    if (trimmed.length < SEARCH_MIN_LENGTH) {
      setError(`Please enter at least ${SEARCH_MIN_LENGTH} characters.`);
      return false;
    }

    setError("");
    return true;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);

    if (error) {
      validateSearch(event.target.value);
    }
  };

  const handleSearch = () => {
    if (!validateSearch(inputValue)) {
      return;
    }

    onSearch(inputValue.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const hasError = Boolean(error);

  return (
    <form
      className={styles.container}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch();
      }}
    >
      <div className={styles.fieldGroup}>
        <label htmlFor="recipe-search" className={styles.visuallyHidden}>
          Search recipes
        </label>
        <input
          id="recipe-search"
          className={`${styles.input} ${hasError ? styles.inputError : ""}`}
          type="search"
          name="search"
          placeholder="Search recipes"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-invalid={hasError}
          aria-describedby={hasError ? "recipe-search-error" : undefined}
        />
        {hasError && (
          <p id="recipe-search-error" className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
      <button className={styles.button} type="submit">
        Search
      </button>
    </form>
  );
}
