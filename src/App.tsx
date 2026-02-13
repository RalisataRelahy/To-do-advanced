import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import MainScreen from "./pages/MainScreen";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/auth";

import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./services/firebase";
import ForgotPassword from "./pages/forgotPassword";
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

  return (
    <Routes>
      {/* ❌ Pas connecté */}
      <Route
        path="/auth"
        element={!user ? <Auth onLogin={function (): void {
          throw new Error("Function not implemented.");
        }} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      {/* ✅ Connecté */}
      <Route
        path="/"
        element={user ? <MainScreen user={user} /> : <Navigate to="/auth" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
