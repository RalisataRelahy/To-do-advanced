import { useEffect, useState } from 'react';
import './App.css';
import MainScreen from './pages/MainScreen';
import SplashScreen from './pages/SplashScreen';
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from './services/firebase';

function App() {
  const [appReady, setAppReady] = useState(false);
  const [user, setUser] = useState<User | null>(null); // pour stocker l'utilisateur connecté

  useEffect(() => {
    // Gestion de l'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Utilisateur connecté :", user.uid);
        setUser(user);
      } else {
        console.log("Utilisateur déconnecté");
        setUser(null);
      }
      // Une fois que l'état de l'auth est connu, on peut considérer l'app prête
      setAppReady(true);
    });

    // Nettoyage du listener quand le composant se démonte
    return () => unsubscribe();
  }, []);

  if (!appReady) {
    // On affiche le splash screen tant que l'app n'est pas prête
    return <SplashScreen />;
  }

  return (
    <div className="app-content">
      {/* Ici tu peux passer l'utilisateur si nécessaire */}
      <MainScreen user={user} />
    </div>
  );
}

export default App;
