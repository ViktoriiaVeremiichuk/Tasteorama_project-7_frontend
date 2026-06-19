"use client";

import { useState } from "react";
import LogoutModal from "../LogoutModal/LogoutModal";

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
      <button type="button" onClick={handleOpenModal}>
        Logout
      </button>

      {isModalOpen && <LogoutModal onClose={handleCloseModal} />}
    </>
  );
}
