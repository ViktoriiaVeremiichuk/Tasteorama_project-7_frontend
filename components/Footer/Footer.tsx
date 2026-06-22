"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/app/icon.png";
import styles from "./Footer.module.css";
import { useAuthStore } from "@/lib/store/authStore";

export default function Footer() {
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const openAuthModal = useAuthStore(
    (state) => state.openAuthModal
  );

  const handleAccountClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!user) {
      e.preventDefault();
      openAuthModal();
    }
  };

  const hideAccountLink =
    pathname === "/login" ||
    pathname === "/register";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Link
          href="/"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className={styles.logo}
        >
          <Image
            src={logo}
            alt="Tasteorama logo"
            width={32}
            height={32}
          />
          <span>Tasteorama</span>
        </Link>

        <p className={styles.copyright}>
          © 2025 Tasteorama. All rights reserved.
        </p>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Recipes
          </Link>

          {!hideAccountLink && (
            <Link
              href="/profile/own"
              className={styles.link}
              onClick={handleAccountClick}
            >
              Account
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}