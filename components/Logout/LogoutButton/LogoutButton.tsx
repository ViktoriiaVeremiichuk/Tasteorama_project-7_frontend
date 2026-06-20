"use client";

import { useState } from "react";
import LogoutModal from "../LogoutModal/LogoutModal";
import Image from "next/image";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button type="button" onClick={handleOpenModal} className={styles.button}>
        <Image
          src="/logOut.svg"
          alt="Log out"
          width={24}
          height={28}
          className={styles.icon}
        />
      </button>

      {isModalOpen && <LogoutModal onClose={handleCloseModal} />}
    </>
  );
}
