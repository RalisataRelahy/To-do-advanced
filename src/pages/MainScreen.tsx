import { useState } from "react";
import Dashboard from "./Dashboard";
import About from "./about";
import "../styles/MainScreen.css";

type Page = "dashboard" | "about";
interface MainScreenProps{
  user:any
}
export default function MainScreen({user}: MainScreenProps) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false); // Ferme le menu après sélection
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard user={user}/>;
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
          <h1>LifeBoard</h1>
          
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