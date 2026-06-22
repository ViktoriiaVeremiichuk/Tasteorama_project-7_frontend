"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Loader from "@/components/Loader/Loader";
import css from "./AuthProvider.module.css";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setUser(user);
      } catch {
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser, clearUser]);

  if (isLoading) {
    return <div className={css.loaderContainer}>
      <Loader />
    </div>;
  }

  return <>{children}</>;
}
