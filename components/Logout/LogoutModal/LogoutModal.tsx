"use client";

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
    } catch {
    } finally {
      clearUser();
      onClose();
      router.push("/");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          ✕
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
