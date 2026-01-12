"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/loginsuccess');
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={webContainer}>
      <div style={meshGradient}></div>
      
      <div style={glassCard}>
        <div style={logoPlaceholder}>🚀</div>
        <h1 style={h1}>Welcome Back</h1>
        <p style={p}>Sign in to your account to continue</p>

        {/* Primary Action: Google */}
        <button 
          onClick={handleGoogleLogin} 
          style={googleBtn} 
          disabled={loading}
        >
          <FcGoogle size={24} /> Continue with Google
        </button>

        <div style={divider}>
          <span style={dividerLine}></span>
          <span style={dividerText}>or</span>
          <span style={dividerLine}></span>
        </div>

        {/* Optional Email Section */}
        {!showEmailLogin ? (
          <button 
            onClick={() => setShowEmailLogin(true)} 
            style={secondaryBtn}
          >
            <MdEmail size={20} /> Sign in with Email
          </button>
        ) : (
          <form onSubmit={handleEmailLogin} style={formStyle}>
            <input 
              type="email" 
              placeholder="Email address" 
              style={inputStyle} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              style={inputStyle} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button type="submit" style={submitBtn} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowEmailLogin(false)} 
              style={backBtn}
            >
              Back to social login
            </button>
          </form>
        )}

        <p style={finePrint}>
          Protected by Firebase Auth. <strong>Terms Apply</strong>.
        </p>
      </div>
    </div>
  );
}

// --- Enhanced Web App Styles ---
const webContainer = {
  height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: '#0f172a', overflow: 'hidden', position: 'relative', fontFamily: '-apple-system, system-ui, sans-serif'
};

const meshGradient = {
  position: 'absolute', width: '140%', height: '140%',
  backgroundImage: `
    radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(260,49%,30%,1) 0, transparent 50%)
  `,
  filter: 'blur(60px)', zIndex: 0, opacity: 0.8
};

const glassCard = {
  background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '28px',
  padding: '40px', width: '90%', maxWidth: '400px', textAlign: 'center', zIndex: 1, color: '#fff',
  boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
};

const logoPlaceholder = { fontSize: '48px', marginBottom: '16px' };
const h1 = { fontSize: '26px', fontWeight: '700', marginBottom: '8px' };
const p = { color: '#94a3b8', marginBottom: '32px', fontSize: '15px' };

const googleBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
  backgroundColor: '#fff', color: '#1e293b', fontWeight: '600', fontSize: '16px',
  cursor: 'pointer', transition: 'transform 0.1s'
};

const secondaryBtn = {
  background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
  width: '100%', padding: '12px', borderRadius: '12px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px'
};

const divider = { display: 'flex', alignItems: 'center', margin: '24px 0', gap: '10px' };
const dividerLine = { flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' };
const dividerText = { color: '#64748b', fontSize: '12px' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputStyle = {
  padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none'
};
const submitBtn = {
  padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6',
  color: '#fff', fontWeight: '600', cursor: 'pointer', marginTop: '5px'
};
const backBtn = {
  background: 'none', border: 'none', color: '#64748b', fontSize: '12px', 
  cursor: 'pointer', marginTop: '8px', textDecoration: 'underline'
};

const finePrint = { color: '#475569', fontSize: '11px', marginTop: '30px' };