"use client";

import { useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";

import {Inter} from "next/font/google";
const inter = Inter({subsets: ["latin"]});

export default function Header(){
    const [menuOpen, setMenuOpen] = useState(false);
    
    const user = { name: "Jhon", avatar:null}; //тимчасова змінна для відображення аватара клієнта
    
    
    
    
    const isLoggedIn = false;   
    return(
        <header className={`${styles.header} ${inter.className}`}>
        <div className={styles.logo}>
            <Image src="/logo.svg" alt="" width={24} height={24}/>
            <span>Tasteorama</span>
        </div>

        {/*Desktop*/}
        <nav className={styles.desktopNav}>
            <div className={styles.navLinks}>
                <Link href="/recipes">Recipes</Link>
                {isLoggedIn && <Link href="/recipes">My Profile</Link>}
            </div>

            <div className={styles.actions}>
            {!isLoggedIn ? (
                <>
                   <button className={styles.button}>Log in</button>
                   <button className={styles.primary}>Register</button>
                </>
            ):(
                <>
                   <button className={styles.primary}>Add Recips</button>
                   <div className={styles.user}>
                    {user.avatar ?(
                        <Image src={user.avatar} alt={user.name} className={styles.avatar}/>
                    ):(
                        <div className={styles.avatarFallback}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {user.name}
                    <button className={styles.logoutBtn}><Image src="/logOut.svg" alt="Log out" width={24} height={28}/></button>
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
                <Link href="/recipes">Recipes</Link>
                <Link href="/logIn">Log in</Link>
              </div> 
                <button className={styles.primary}>Register</button>
            </>
          ) : (
            <>
                <Link href="/recipes">Recipes</Link>
                <Link href="/profile">My Profile</Link>
                <div className={styles.user}>
                    {user.avatar ?(
                        <Image src={user.avatar} alt={user.name} className={styles.avatar}/>
                    ):(
                        <div className={styles.avatarFallback}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {user.name}
                    <button className={styles.logoutBtn}><Image src="/logOut.svg" alt="Log out" width={24} height={28}/></button>
                   </div>
                <button className={styles.primary}>Add Recipe</button>
            </>
          )}
        </div>
      )}
        
        </header>
    );
}