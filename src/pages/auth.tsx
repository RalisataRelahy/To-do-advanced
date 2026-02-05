// Auth.tsx
import { useState, type FC } from "react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

interface AuthProps {
  onLogin: () => void;
}

const Auth: FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account?" : "Create an account"}
      </button>
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
};

export default Auth;
