import { useState } from "react";
import { resetPassword } from "../services/resetPassword";
import "../styles/auth.css"
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      setMessage(
        "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé! Verifier votre spam!"
      );
    } catch {
      setError("Impossible d'envoyer l'email pour le moment 😕");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-glass">
        <h2 className="auth-title-glass">Mot de passe oublié</h2>

        <form onSubmit={handleSubmit} className="auth-form-glass">
          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label-glass">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              className="auth-input-glass"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button-glass"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-loading"></span>
            ) : (
              "Réinitialiser"
            )}
          </button>

          {message && (
            <div className="auth-success-glass">
              {message}
            </div>
          )}
          
          {error && (
            <div className="auth-error-glass">
              {error}
            </div>
          )}
        </form>

        <button 
          className="auth-switch-glass"
          onClick={() => window.history.back()}
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;