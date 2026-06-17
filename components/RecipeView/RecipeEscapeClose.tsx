"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type RecipeEscapeCloseProps = {
  children: ReactNode;
};

export default function RecipeEscapeClose({
  children,
}: RecipeEscapeCloseProps) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      router.back();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return children;
}
