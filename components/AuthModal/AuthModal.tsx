"use client";

import Link from "next/link";
import styles from "./AuthModal.module.css";
import { useAuthStore } from "@/lib/store/authStore";

export const AuthModal = () => {
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);

  return (
    <div className={styles.overlay} onClick={closeAuthModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={closeAuthModal}>
          <svg
            className={styles.closeIcon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5.25 5.25L12 12M12 12L5.25 18.75M12 12L18.75 18.75M12 12L18.75 5.25"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2 className={styles.title}>Error while saving</h2>

        <p className={styles.text}>
          To save this recipe, you need to <br /> authorize first
        </p>

        <div className={styles.actions}>
          <Link
            href="/login"
            className={styles.loginBtn}
            onClick={closeAuthModal}
          >
            Log in
          </Link>

          <Link
            href="/register"
            className={styles.registerBtn}
            onClick={closeAuthModal}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
