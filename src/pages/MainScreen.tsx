import { useState } from "react";
import Dashboard from "./Dashboard";
import About from "./about";
import "../styles/MainScreen.css";

type Page = "dashboard" | "about";

export default function MainScreen() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "about":
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="main-screen">
      <nav className="main-nav">
        <div className="flex justify-between items-center h-16">
            <h1>Personal Dashboard</h1>
        </div>
            <div className="btn">
                <button
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setCurrentPage("dashboard")}
            >
            Dashboard
            </button>
            <button
            className={currentPage === "about" ? "active" : ""}
            onClick={() => setCurrentPage("about")}
            >
            About
            </button>
        </div>
        
      </nav>

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}
