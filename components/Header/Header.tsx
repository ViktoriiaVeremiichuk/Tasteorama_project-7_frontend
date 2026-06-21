"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";

import LogoutModal from "../Logout/LogoutModal/LogoutModal";

import { useAuthStore } from "@/lib/store/authStore";
import { useSearchStore } from "@/app/store/searchStore";

const inter = Inter({ subsets: ["latin"] });

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const resetFilters = useSearchStore(
    (state) => state.resetFilters
  );

  useEffect(() => {
    if (user) return;

    async function loadUser() {
      const res = await fetch("/api/users/current", {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data) {
        setUser(data);
      }
    }

    loadUser();
  }, [user, setUser]);

  // loader: блокуємо скрол під час відкритого меню
  useEffect(() => {
    document.body.style.overflow =
      menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const displayName = user
    ? user.name?.trim() ||
      user.email.split("@")[0]
    : "";

  const avatarLetter = displayName
    ? displayName.charAt(0).toUpperCase()
    : "";

  const pathname = usePathname();

  const isRecipesActive =
    pathname === "/" ||
    pathname.startsWith("/recipes");

  const isLoginActive =
    pathname.startsWith("/login");

  const isProfileActive =
    pathname.startsWith("/profile");

  const isLoggedIn = Boolean(user);

  const handleLogoClick = () => {
    resetFilters();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header
      id="top"
      className={`${styles.header} ${inter.className}`}
    >
      <Link
        href="/"
        className={styles.logo}
        onClick={handleLogoClick}
      >
        <Image
          src="/logo.svg"
          alt="Tasteorama logo"
          width={24}
          height={24}
        />

        <span>Tasteorama</span>
      </Link>

      <nav className={styles.desktopNav}>
        <div className={styles.navLinks}>
          <Link
            href="/"
            className={`${styles.navLink} ${
              isRecipesActive
                ? styles.activeLink
                : ""
            }`}
          >
            Recipes
          </Link>

          {isLoggedIn && (
            <Link
              href="/profile"
              className={`${styles.navLink} ${
                isProfileActive
                  ? styles.activeLink
                  : ""
              }`}
            >
              My Profile
            </Link>
          )}
        </div>

        <div className={styles.actions}>
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className={`${styles.loginLink} ${
                  isLoginActive
                    ? styles.activeLink
                    : ""
                }`}
              >
                Log in
              </Link>

              <Link
                href="/register"
                className={styles.primary}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/add-recipe"
                className={styles.primary}
              >
                Add Recipe
              </Link>

              <div className={styles.userSection}>
                <div className={styles.user}>
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={displayName}
                      width={32}
                      height={32}
                      className={styles.avatar}
                    />
                  ) : (
                    <div
                      className={
                        styles.avatarFallback
                      }
                    >
                      {avatarLetter}
                    </div>
                  )}

                  <span>{displayName}</span>
                </div>

                <button
                  className={styles.logoutBtn}
                  onClick={() =>
                    setLogoutOpen(true)
                  }
                >
                  <Image
                    src="/logOut.svg"
                    alt="Log out"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      <button
        className={`${styles.burger} ${
          menuOpen
            ? styles.closeButton
            : ""
        }`}
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        {menuOpen ? (
          <Image
            src="/close.svg"
            alt="Close menu"
            width={32}
            height={32}
          />
        ) : (
          <Image
            src="/burger.svg"
            alt="Open menu"
            width={32}
            height={32}
          />
        )}
      </button>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {!isLoggedIn ? (
            <>
              <div
                className={styles.mobileLink}
              >
                <Link href="/">
                  Recipes
                </Link>

                <Link href="/login">
                  Log in
                </Link>
              </div>

              <Link
                href="/register"
                className={styles.primary}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link href="/">
                Recipes
              </Link>

              <Link href="/profile">
                My Profile
              </Link>

              <div
                className={styles.userSection}
              >
                <div className={styles.user}>
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={displayName}
                      width={32}
                      height={32}
                      className={
                        styles.avatar
                      }
                    />
                  ) : (
                    <div
                      className={
                        styles.avatarFallback
                      }
                    >
                      {avatarLetter}
                    </div>
                  )}

                  {displayName}
                </div>

                <button
                  className={styles.logoutBtn}
                  onClick={() =>
                    setLogoutOpen(true)
                  }
                >
                  <Image
                    src="/logOut.svg"
                    alt="Log out"
                    width={24}
                    height={24}
                  />
                </button>
              </div>

              <Link
                href="/add-recipe"
                className={styles.primary}
              >
                Add Recipe
              </Link>
            </>
          )}
        </div>
      )}

      {logoutOpen && (
        <LogoutModal
          onClose={() =>
            setLogoutOpen(false)
          }
        />
      )}
    </header>
  );
}