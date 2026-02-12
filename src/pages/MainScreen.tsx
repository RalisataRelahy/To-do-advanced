import { useState } from "react";
import Dashboard from "./Dashboard";
import About from "./about";
import "../styles/MainScreen.css";
// import { getAuth, signOut } from "../services/firebase";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
type Page = "dashboard" | "about";
interface MainScreenProps {
  user: any
}
export default function MainScreen({ user }: MainScreenProps) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  const handleLogOut = () => {
    try {
      signOut(auth);
      // window.location.href = "/";
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false); // Ferme le menu après sélection
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "about":
        return <About />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="main-screen">
      <nav className="main-nav">
        <div className="nav-container">
          <div className="title-header">
            <img
              src="/logos.png"
              alt="Logo LifeBoard"
              width={48}
              height={48}
              className="logo"
            />
            <h1 className="app-title">LifeBoard</h1>
          </div>


          {/* Bouton burger */}
          <button
            className={`burger-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Menu navigation */}
          <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <button
              className={currentPage === "dashboard" ? "active" : ""}
              onClick={() => handleNavigation("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={currentPage === "about" ? "active" : ""}
              onClick={() => handleNavigation("about")}
            >
              About
            </button>
            <button onClick={() => { handleLogOut() }}>Se deconnecter</button>
          </div>
        </div>
      </nav>

      {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
      {isMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}