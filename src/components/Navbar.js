"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const isDashboard = pathname === '/dashboard';

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          Universal Wishlist.
        </Link>
        
        {/* Dektop Menu */}
        <nav className={styles.desktopMenu}>
          <Link href="/" className={styles.link}>Hem</Link>
          <Link href="/about" className={styles.link}>Om oss & Tankar</Link>
          <Link href="/dashboard" className={styles.link}>Dashboard</Link>
          <div className={styles.authLinks}>
            {isDashboard ? (
              <button onClick={handleLogout} className="btn-secondary">Logga ut</button>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">Logga in</Link>
                <Link href="/register" className="btn-primary">Skapa konto</Link>
              </>
            )}
          </div>
        </nav>

        {/* Hamburger Icon */}
        <button className={styles.hamburger} onClick={toggleMenu}>
          <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileLink} onClick={toggleMenu}>Hem</Link>
          <Link href="/about" className={styles.mobileLink} onClick={toggleMenu}>Om oss & Tankar</Link>
          <Link href="/dashboard" className={styles.mobileLink} onClick={toggleMenu}>Dashboard</Link>
          <Link href="/login" className={styles.mobileAuthBtn} onClick={toggleMenu}>Logga in</Link>
          <Link href="/register" className={styles.mobileAuthBtnPrimary} onClick={toggleMenu}>Skapa konto</Link>
        </nav>
      )}
    </header>
  );
}
