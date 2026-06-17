import React from "react";
import  Link  from "next/link";
import { usePathname } from 'next/navigation';
import style from "./ProfileNavigation.module.css";

const ProfileNavigation = () => {
    const pathname = usePathname();

    return (
       <nav className={style.nav}>

        <Link href="/profile/own" className={`${style.title} ${pathname === '/profile/own' ? style.active : ''}`}>
           My recipes
        </Link>

        <Link href="/profile/favorites" className={`${style.title} ${pathname === '/profile/favorites' ? style.active : ''}`}>
           Saved Recipes
        </Link>

       </nav>
    );
};



export default ProfileNavigation;
