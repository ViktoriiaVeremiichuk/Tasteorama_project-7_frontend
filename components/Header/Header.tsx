"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "../Logout/LogoutButton/LogoutButton";
import LogoutModal from "../Logout/LogoutModal/LogoutModal";

import { Inter } from "next/font/google";

import { useAuthStore } from "@/lib/store/authStore";
const inter = Inter({ subsets: ["latin"] });

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (user) return;
    async function loadUser() {
      const res = await fetch("/api/users/current", {
        credentials: "include",
      });
      if (!res.ok) {
        return;
      }

      const data = await res.json();

      if (data) {
        setUser(data);
      }
    }
    loadUser();
  }, [user, setUser]);

  const displayName = user ? user.name?.trim() || user.email.split("@")[0] : "";
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "";

  const pathname = usePathname();
  const isRecipesActive = pathname === "/" || pathname.startsWith("/recipes");
  const isLoginActive = pathname.startsWith("/login");
  const isProfileActive = pathname.startsWith("/profile");

  const isLoggedIn = Boolean(user);
  return (
    <header className={`${styles.header} ${inter.className}`}>
      <Link href="/" className={styles.logo}>
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
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={displayName}
                      width={32}
                      height={32}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>{avatarLetter}</div>
                  )}
                  <span>{displayName}</span>
                </div>

                <LogoutButton />
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
          {!isLoggedIn ? (
            <>
              <div className={styles.mobileLink}>
                <Link
                  href="/"
                  className={`${styles.navLink} ${isRecipesActive ? styles.activeLink : ""}`}
                >
                  Recipes
                </Link>
                <Link
                  href="/login"
                  className={`${styles.loginLink} ${isLoginActive ? styles.activeLink : ""}`}
                >
                  Log in
                </Link>
              </div>
              <Link href="/register" className={styles.primary}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`${styles.navLink} ${isRecipesActive ? styles.activeLink : ""}`}
              >
                Recipes
              </Link>
              <Link
                href="/profile"
                className={`${styles.navLink} ${isProfileActive ? styles.activeLink : ""}`}
              >
                My Profile
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
                    <div className={styles.avatarFallback}>{avatarLetter}</div>
                  )}
                  {displayName}
                </div>
                <LogoutButton />
              </div>
              <Link href="/add-recipe" className={styles.primary}>
                Add Recipe
              </Link>
            </>
          )}
        </div>
      )}
      {logoutOpen && (<LogoutModal onClose={()=> setLogoutOpen(false)}/>)}
    </header>
  );
}


