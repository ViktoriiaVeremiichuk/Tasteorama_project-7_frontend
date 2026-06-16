import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import style from './ProfileNavigation.module.css';


const ProfileNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className={style.nav}>

      <Link 
        href="/profile/own" 
        className={`${style.link} ${pathname === '/profile/own' ? style.active : ''}`}
      >
        My recipes
      </Link>

         <Link 
        href="/profile/favorites" 
        className={`${style.link} ${pathname === '/profile/favorites' ? style.active : ''}`}
      >
        Saved recipes
      </Link>
    </nav>
  );
};

export default ProfileNavigation;