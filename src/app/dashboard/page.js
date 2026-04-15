"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './dashboard.module.css';

function DashboardContent() {
  const [urlInput, setUrlInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
    
    const addUrl = searchParams.get('addUrl');
    if (addUrl) {
      setUrlInput(addUrl);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products/list');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/products/sync', { method: 'POST' });
      if (res.ok) {
        await fetchProducts();
      }
    } catch(err) {
      alert('Misslyckades att synkronisera');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Kunde inte nå servern för radering.');
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!urlInput || !sizeInput) return;
    
    setIsAdding(true);
    try {
      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput, targetSize: sizeInput }),
      });
      
      const data = await res.json();
      if (data.success) {
        setUrlInput('');
        setSizeInput('');
        setProducts([data.product, ...products]);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Gick inte att ansluta, försök igen.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.main}>
        <div className={styles.actionBar}>
          <div className={styles.actionHeader}>
            <h1>Din Bevakning</h1>
            <button onClick={handleSync} disabled={isSyncing} className={`btn-secondary ${styles.syncBtn}`}>
              {isSyncing ? '🔄 Laddar...' : '🔄 Uppdatera priser'}
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Klistra in en produktlänk för att starta. <br/>
            <span style={{ fontSize: '0.85rem' }}>💡 <b>Tips!</b> Fungerar bäst på e-handlare som Webhallen, Inet, Apotea, Kjell & Co, samt mindre modebutiker.</span>
          </p>
          <form className={styles.addForm} onSubmit={handleAddLink}>
            <input 
              type="url" 
              placeholder="Din önskade länk (Zalando, Nike etc)..." 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className={styles.urlInput}
              disabled={isAdding}
              required
            />
            <input 
              type="text" 
              placeholder="Din strl (ex: 43, M)" 
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              className={styles.sizeInput}
              disabled={isAdding}
              required
            />
            <button type="submit" className={`btn-primary ${styles.addBtn}`} disabled={isAdding}>
              {isAdding ? 'Söker...' : 'Bevaka'}
            </button>
          </form>
        </div>

        <div className={styles.grid}>
          {loading ? (
             <p style={{color: 'var(--text-muted)'}}>Laddar dina produkter...</p>
          ) : products.length === 0 ? (
            <div className={`glass-panel ${styles.emptyState}`}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>Inga produkter sparade ännu</h3>
              <p>Kopiera en länk från ditt favoritmärke, fyll i din storlek och klistra in ovan för att börja bevaka.</p>
              <p style={{marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                💡 Systemet fungerar fantastiskt på butiker som Webhallen, Inet, Apotea, Lyko m.fl.
              </p>
            </div>
          ) : (
            products.map((product) => {
              const initialPrice = product.priceHistory?.[0]?.price || product.currentPrice;
              const hasDropped = product.currentPrice < initialPrice;
              const dropAmount = initialPrice - product.currentPrice;

              return (
              <a href={product.url} target="_blank" rel="noopener noreferrer" key={product._id} className={`glass-panel ${styles.productCard}`}>
                
                {/* Ta bort knapp */}
                <button 
                  onClick={(e) => handleDelete(e, product._id)} 
                  className={styles.deleteBtn}
                  title="Ta bort bevakning"
                >
                  ✕
                </button>

                <div className={styles.imageContainer}>
                  {product.image ? (
                     <img src={product.image} alt={product.title} className={styles.productImage} />
                  ) : (
                     <div className={styles.noImage}>Ingen bild tillgänglig</div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <div className={styles.sizeInfo}>
                    <span className={product.isSizeInStock ? styles.inStock : styles.outOfStock}>
                      {product.isSizeInStock ? `🔥 Strl ${product.targetSize} finns i lager!` : `❌ Strl ${product.targetSize} är tillfälligt slut`}
                    </span>
                  </div>
                  <div className={styles.priceRow}>
                    <p className={styles.currentPrice}>{product.currentPrice} kr</p>
                    {hasDropped ? (
                       <span className={styles.priceDropBadge}>📉 Sänkt -{dropAmount} kr!</span>
                    ) : (
                       <span className={styles.trendIcon}>📉 Bevakas aktivt</span>
                    )}
                  </div>
                </div>
              </a>
            )})
          )}
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{color: '#fff', padding: '40px'}}>Laddar dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
