"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.error || 'Något gick fel');
    }
  };

  return (
    <div className={styles.authContainer}>
      <Link href="/" className={styles.backLink}>← Tillbaka</Link>
      <div className={`glass-panel ${styles.authCard}`}>
        <h1 className={styles.title}>Skapa konto</h1>
        <p className={styles.subtitle}>Börja spara och bevaka dina favoritprodukter.</p>
        
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
              placeholder="Minst 8 tecken"
              required 
            />
          </div>
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Skapa konto</button>
        </form>
        <div className={styles.footer}>
          Redan medlem? <Link href="/login" className={styles.link}>Logga in</Link>
        </div>
      </div>
    </div>
  );
}
