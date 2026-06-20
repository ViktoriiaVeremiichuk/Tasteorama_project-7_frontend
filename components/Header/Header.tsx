"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
//import LogoutModal from "../Logout/LogoutModal/LogoutModal"

import {Inter} from "next/font/google";
const inter = Inter({subsets: ["latin"]});

export default function Header(){
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const user = {name: "Jhon", email: "jhon@gmail.com", avatar: null,};
    const displayName = user.name?.trim()|| user.email.split("@")[0];
    const avatarLetter = displayName.charAt(0).toUpperCase(); //тимчасова змінна для відображення аватара клієнта
    
    const pathname = usePathname();
    const isRecipesActive = pathname === "/" || pathname.startsWith("/recipes");
    const isLoginActive = pathname.startsWith("/login");
    const isProfileActive = pathname.startsWith("/profile");
    
    const isLoggedIn = true;   
    return(
        <header className={`${styles.header} ${inter.className}`}>
        <Link href="/" className={styles.logo}>
            <Image src="/logo.svg" alt="Tasteorama logo" width={24} height={24}/>
            <span>Tasteorama</span>
        </Link>

        {/*Desktop*/}
        <nav className={styles.desktopNav}>
            <div className={styles.navLinks}>
                <Link href="/recipes" className={`${styles.navLink} ${isRecipesActive ? styles.activeLink : ""}`}>Recipes</Link>
                {isLoggedIn && <Link href="/profile" className={`${styles.navLink} ${isProfileActive ? styles.activeLink : ""}`}>My Profile</Link>}
            </div>

            <div className={styles.actions}>
            {!isLoggedIn ? (
                <>
                   <Link href="/login" className={`${styles.loginLink} ${isLoginActive ? styles.activeLink : "" }`}>Log in</Link>
                   <Link href="/register" className={styles.primary}>Register</Link>
                </>
            ):(
                <>
                   <Link href="/addRecipe" className={styles.primary}>Add Recips</Link>
                   <div className={styles.userSection}>
                    <div className={styles.user}>
                    
                    {user.avatar ?(
                        <Image src={user.avatar} alt={displayName} width={32} height={32} className={styles.avatar}/>
                    ):(
                        <div className={styles.avatarFallback}>
                            {avatarLetter}
                        </div>
                    )}
                    <span>{displayName}</span>
                    </div>
                    <button className={styles.logoutBtn} onClick={()=>setLogoutOpen(true)}><Image src="/logOut.svg" alt="Log out" width={24} height={24}/></button>
                   </div>
                </>
            )}
            </div>
        </nav>

        {/* Mobile burger */}
        <button className={`${styles.burger} ${menuOpen ? styles.closeButton: ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? (
            <Image src="/close.svg" alt="Close menu" width={32} height={32}/>
        ):(
            <Image src="/burger.svg" alt="Open menu" width={32} height={32}/>
        )}
        </button>

        {/* Mobile drawer */}
        {menuOpen && (
            <div className={styles.mobileMenu}>
                {!isLoggedIn ? (
            <>
              <div className={styles.mobileLink}>
                <Link href="/recipes"className={`${styles.navLink} ${isRecipesActive ? styles.activeLink : ""}`}>Recipes</Link>
                <Link href="/login" className={`${styles.loginLink} ${isLoginActive ? styles.activeLink : "" }`}>Log in</Link>
              </div> 
              <Link href="/register" className={styles.primary}>Register</Link>
            </>
          ) : (
            <>
                <Link href="/recipes" className={`${styles.navLink} ${isRecipesActive ? styles.activeLink : ""}`}>Recipes</Link>
                <Link href="/profile" className={`${styles.navLink} ${isProfileActive ? styles.activeLink : ""}`}>My Profile</Link>
                <div className={styles.userSection}>
                <div className={styles.user}>
                    {user.avatar ?(
                        <Image src={user.avatar} alt={displayName} width={32} height={32} className={styles.avatar}/>
                    ):(
                        <div className={styles.avatarFallback}>
                            {avatarLetter}
                        </div>
                    )}
                    {displayName}
                    </div>
                    <Link href="/logout" className={styles.logoutBtn}><Image src="/logOut.svg" alt="Log out" width={24} height={28}/></Link>
                   </div>
                   <Link href="/addRecipe" className={styles.primary}>Add Recips</Link>
            </>
          )}
        </div>
      )}
        {logoutOpen && (<LogoutModal onClose={()=> setLogoutOpen(false)}/>)}
        </header>
    );
}