'use client';

import { useState } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
    onSearch: (value: string) => void;
    initialValue?: string;
}

const SEARCH_MIN_LENGTH = 3;

export default function SearchBox({ onSearch, initialValue = "" }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [error, setError] = useState("");

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

  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setInputValue(e.target.value);
    if (error) {
      validateSearch(e.target.value);
    }
  };

  const handleSearch = () => {
    if (!validateSearch(inputValue)) {
      return;
    }

    onSearch(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.fieldGroup}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search recipes"
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <button className={styles.button} type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}