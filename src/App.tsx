import { useEffect, useState } from 'react';
import './App.css';
import MainScreen from './pages/MainScreen';
import SplashScreen from './pages/SplashScreen';

function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Ici tu peux vraiment attendre le chargement des fonts / données / auth
    setTimeout(() => {
      setAppReady(true);
    }, 1800);
  }, []);
  return (
    <>
    <SplashScreen />
    {appReady && (
        <div className="app-content">
          {/* Ton application normale */}
          <MainScreen/>
        </div>
      )}
      
    </>
  )
}

export default App
