import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={styles.container}>
      <h1>Welcome</h1>
      <p>Click below to view the map.</p>
      
      {/* Next.js Link is better for performance than a standard <a> tag */}
      <Link href="/map" style={styles.button}>
        Go to Map
      </Link>
    </div>
  );
}

// Basic styling to make the button look like a button
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'sans-serif'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#0070f3',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '20px'
  }
};
