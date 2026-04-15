"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../register/auth.module.css'; // återanvänder css

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Något gick fel');
    }
  };

  return (
    <div className={styles.authContainer}>
      <Link href="/" className={styles.backLink}>← Tillbaka</Link>
      <div className={`glass-panel ${styles.authCard}`}>
        <h1 className={styles.title}>Välkommen tillbaka</h1>
        <p className={styles.subtitle}>Logga in för att se dina prisbevakningar.</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>E-postadress</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="din@epost.se"
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Lösenord</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Ditt lösenord"
              required 
            />
          </div>
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Logga in</button>
        </form>
        <div className={styles.footer}>
          Inget konto? <Link href="/register" className={styles.link}>Skapa ett här</Link>
        </div>
      </div>
    </div>
  );
}
