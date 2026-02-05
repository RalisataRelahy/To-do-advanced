import { useEffect, useState } from "react";
import "./App.css";
import MainScreen from "./pages/MainScreen";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/auth";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./services/firebase";

function App() {
  const [appReady, setAppReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAppReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!appReady) {
    return <SplashScreen />;
  }

  // ❌ Pas connecté → Auth
  if (!user) {
    return (
      <Auth
        onLogin={() => {
          // Rien à faire ici 😌
          // onAuthStateChanged va se déclencher automatiquement
          console.log("Login réussi");
        }}
      />
    );
  }

  // ✅ Connecté → App principale
  return (
    <div className="app-content">
      <MainScreen user={user} />
    </div>
  );
}

export default App;
