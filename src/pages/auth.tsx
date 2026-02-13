import { useState, type FC } from "react";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

interface AuthProps {
  onLogin: () => void;
}

const Auth: FC<AuthProps> = (/*{ onLogin }*/) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // onLogin();
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const goToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="auth-page">
      <div className="auth-card-glass">
        <h2 className="auth-title-glass">
          {isSignup ? "Créer un compte" : "Connexion"}
        </h2>

        <form className="auth-form-glass" onSubmit={handleSubmit}>
          <input
            className="auth-input-glass"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input-glass"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-button-glass" type="submit">
            {isSignup ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <button
          className="auth-switch-glass"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Déjà un compte ? Se connecter"
            : "Créer un compte"}

        </button>
        {!isSignup && (
          <button
            className="auth-switch-glass"
            onClick={goToForgotPassword}
          >
            Mot de passe oublié ?
          </button>
        )}


        {error && <p className="auth-error-glass">{error}</p>}
      </div>
    </div>
  );
};

export default Auth;
