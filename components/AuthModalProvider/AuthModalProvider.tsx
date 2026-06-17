"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { AuthModal } from "@/components/AuthModal/AuthModal";

export default function AuthModalProvider() {
  const isOpen = useAuthStore((s) => s.isAuthModalOpen);

  if (!isOpen) return null;

  return <AuthModal />;
}
