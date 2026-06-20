import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ProfileNavigation.module.css';

export default function ProfileNavigation() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: 'My Recipes',
      href: '/profile/own',
    },
    {
      name: 'Saved Recipes',
      href: '/profile/favorites',
    },
  ];

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${isActive ? styles.active : ''}`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}