"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./LogoutModal.module.css";

type Props = {
  onClose: () => void;
};

const LogoutModal = ({ onClose }: Props) => {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearUser();
      onClose();
      router.push("/");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.25 5.25L12 12M12 12L5.25 18.75M12 12L18.75 18.75M12 12L18.75 5.25"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2 className={styles.title}>Are you sure?</h2>

        <p className={styles.text}>We will miss you!</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
