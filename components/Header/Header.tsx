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
  const resetFilters = useSearchStore((state) => state.resetFilters);

  useEffect(() => {
    if (user) return;

    async function loadUser() {
      try {
        const res = await fetch("/api/users/current", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to load user", error);
      }
    }

    loadUser();
  }, [user, setUser]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const displayName = user ? user.name?.trim() || user.email.split("@")[0] : "";
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "";

  const pathname = usePathname();
  const isRecipesActive = pathname === "/" || pathname.startsWith("/recipes");
  const isLoginActive = pathname.startsWith("/login");
  const isProfileActive = pathname.startsWith("/profile");

  const isLoggedIn = Boolean(user);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    resetFilters();
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    resetFilters();
    setMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${inter.className}`}>
      <Link href="/" className={styles.logo} onClick={handleLogoClick}>
        <Image src="/logo.svg" alt="Tasteorama logo" width={24} height={24} />
        <span>Tasteorama</span>
      </Link>

      {/*Desktop*/}
      <nav className={styles.desktopNav}>
        <div className={styles.navLinks}>
          <Link
            href="/"
            className={`${styles.navLink} ${isRecipesActive ? styles.activeLink : ""}`}
          >
            Recipes
          </Link>
          {isLoggedIn && (
            <Link
              href="/profile"
              className={`${styles.navLink} ${isProfileActive ? styles.activeLink : ""}`}
              onClick={handleProfileClick}
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
                className={`${styles.loginLink} ${isLoginActive ? styles.activeLink : ""}`}
              >
                Log in
              </Link>
              <Link href="/register" className={styles.primary}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link href="/add-recipe" className={styles.primary}>
                Add Recipe
              </Link>
              <div className={styles.userSection}>
                <div className={styles.user}>
                  <div className={styles.avatarFallback}>{avatarLetter}</div>
                  <span>{displayName}</span>
                </div>
                <button
                  className={styles.logoutBtn}
                  onClick={() => setLogoutOpen(true)}
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

      {/* Mobile burger */}
      <button
        className={`${styles.burger} ${menuOpen ? styles.closeButton : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <Image src="/close.svg" alt="Close menu" width={32} height={32} />
        ) : (
          <Image src="/burger.svg" alt="Open menu" width={32} height={32} />
        )}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileTop}>
            <Link href="/" className={styles.logo} onClick={handleLogoClick}>
              <Image
                src="/logo.svg"
                alt="Tasteorama logo"
                width={24}
                height={24}
              />
              <span>Tasteorama</span>
            </Link>

            <button
              className={styles.closeButton}
              onClick={() => setMenuOpen(false)}
            >
              <Image src="/close.svg" alt="Close menu" width={32} height={32} />
            </button>
          </div>

          {!isLoggedIn ? (
            <>
              <div className={styles.mobileLink}>
                <Link
                  href="/"
                  className={`${styles.navLink} ${isRecipesActive ? styles.activeLink : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Recipes
                </Link>
                <Link
                  href="/login"
                  className={`${styles.loginLink} ${isLoginActive ? styles.activeLink : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
              </div>

              <Link
                href="/register"
                className={styles.primary}
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className={styles.mobileLink}>
                <Link
                  href="/"
                  className={`${styles.navLink} ${isRecipesActive ? styles.activeLink : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Recipes
                </Link>
                <Link
                  href="/profile"
                  className={`${styles.navLink} ${isProfileActive ? styles.activeLink : ""}`}
                  onClick={handleProfileClick}
                >
                  My Profile
                </Link>
              </div>

              <div className={styles.userSection}>
                <div className={styles.user}>
                  <div className={styles.avatarFallback}>{avatarLetter}</div>
                  <span>{displayName}</span>
                </div>
                <button
                  className={styles.logoutBtn}
                  onClick={() => {
                    setMenuOpen(false);
                    setLogoutOpen(true);
                  }}
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
                onClick={() => setMenuOpen(false)}
              >
                Add Recipe
              </Link>
            </>
          )}
        </div>
      )}
      {logoutOpen && <LogoutModal onClose={() => setLogoutOpen(false)} />}
    </header>
  );
}
