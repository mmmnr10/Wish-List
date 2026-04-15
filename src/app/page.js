import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>

      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={`text-gradient animate-fade-in ${styles.title}`}>
              Dina drömköp & priser.<br />
              <span className={styles.accent}>Övervakade på ett ställe.</span>
            </h1>
            <p className={`animate-fade-in delay-100 ${styles.subtitle}`}>
              Spara och prisbevaka direkt i appen. Klistra in länken och låt "Universal Tracker" hämta prislapp och bild. <br/>(Perfekt för svensk e-handel och tech-prylar)
            </p>
            <div className={`animate-fade-in delay-200 ${styles.ctaGroup}`}>
              <Link href="/register" className="btn-primary">Kom igång gratis</Link>
              <Link href="/about" className="btn-secondary">Läs om visionen</Link>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className={styles.glowBlob}></div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <div className={styles.grid}>
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <div className={styles.featureIcon}>✅</div>
              <h3>Verifierade Butiker</h3>
              <p style={{color: 'var(--text-muted)'}}>
                Fungerar utmärkt på hundratals butiker, i synnerhet: <br/><br/>
                <b>Webhallen, Apotea, Inet, NetOnNet, Lyko & Kjell & Co.</b>
              </p>
            </div>
            
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <div className={styles.featureIcon}>⚠️</div>
              <h3>Mindre = Bättre</h3>
              <p style={{color: 'var(--text-muted)'}}>
                Internationella mega-kedjor som <b>Nike, Zalando & H&M</b> har ofta extrema bot-skydd. Koden försöker hämta bilden, annars skapas ett snyggt sparkort ändå.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <div className={styles.featureIcon}>💎</div>
              <h3>Premium Upplevelse</h3>
              <p style={{color: 'var(--text-muted)'}}>Ett gränssnitt fritt från röran. Byggt för mjuk, levande 60FPS upplevelse och en rent av njutbar användbarhet.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
