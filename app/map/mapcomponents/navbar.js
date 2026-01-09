// map/map-components/navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99999, // Extremely high to stay above MapLibre
      width: '90%',
      maxWidth: '400px',
      pointerEvents: 'none' // Allows clicking the map through the gaps
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '15px 40px',
        borderRadius: '50px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        border: '1px solid rgba(0,0,0,0.1)',
        pointerEvents: 'auto', // Re-enables clicking for the buttons
        position: 'relative'
      }}>
        
        {/* PROFILE */}
        <Link href="/profile" style={{ textDecoration: 'none', textAlign: 'center' }}>
           <div style={{ width: '24px', height: '24px', border: '2px solid #666', margin: '0 auto', borderRadius: '4px' }}></div>
           <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#666', display: 'block', marginTop: '4px' }}>PROFILE</span>
        </Link>

        {/* BIG RED QR SCANNER */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <Link href="/qrscanner" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#e70b0bff',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '6px solid white',
            }}>
              {/* Simple QR Icon Placeholder */}
              <div style={{ width: '30px', height: '30px', border: '3px solid white' }}></div>
            </div>
          </Link>
        </div>

        {/* Space for the center button */}
        <div style={{ width: '40px' }}></div>

        {/* SETTINGS */}
        <Link href="/settings" style={{ textDecoration: 'none', textAlign: 'center' }}>
           <div style={{ width: '24px', height: '24px', border: '2px solid #666', margin: '0 auto', borderRadius: '50%' }}></div>
           <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#666', display: 'block', marginTop: '4px' }}>SETTINGS</span>
        </Link>
        
      </div>
    </nav>
  );
}