// src/components/SplashScreen.tsx
import { useState, useEffect } from 'react';
import '../styles/splashScreen.css';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simule le temps de chargement (ou attends vraiment les données)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200); // 2.2 secondes

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img
          src="/logos.png"           // ou ton logo en png/webp
          alt="Logo"
          className="splash-logo"
        />
        <h1>LifeBOAR-D</h1>
        <div className="loader"></div>
      </div>
    </div>
  );
}