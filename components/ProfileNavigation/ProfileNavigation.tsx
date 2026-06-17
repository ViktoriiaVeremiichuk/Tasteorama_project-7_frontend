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
          // Перевіряємо, чи збігається поточний URL із посиланням
          const isActive = pathname === link.href;

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