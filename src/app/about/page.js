import styles from '../dashboard/dashboard.module.css';

export default function About() {
  return (
    <main className={styles.dashboardContainer} style={{ minHeight: 'calc(100vh - 80px)'}}>
      <div className={styles.main}>
        <div className={styles.actionBar}>
          <h1>Mina Tankar Kring Sidan</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '800px', marginTop: '20px' }}>
            Visionen bakom Universal Wishlist är superenkel. Jag blev trötta på att ha 10 olika 
            appar för att spara skor från Nike, tröjor från Zalando och tech från Webhallen. <br/><br/>
            E-handeln har blivit alldeles för fragmenterad. Så jag byggde detta premium-verktyg för 
            att automatisera jobbet. Du klistrar in en länk, du fyller i din storlek. Sedan väntar du.
            Är storleken slut? Systemet vet det. Går priset ner? Systemet bevakar det.<br/><br/>
            Det handlar inte bara om att köpa grejer – det handlar om att äga sin egen data
            och få en snyggare, mer transparent shoppingupplevelse på sina egna villkor.
          </p>
        </div>
      </div>
    </main>
  );
}
