// import React from "react";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-page">
      <h1>À propos de LifeBoard</h1>

      <p>
        LifeBoard est un tableau de bord personnel conçu pour suivre vos tâches,
        vos objectifs et votre progression quotidienne.  
        Il est construit avec <strong>React + TypeScript</strong> et utilise le
        <strong> localStorage</strong> pour sauvegarder vos données directement
        dans votre navigateur.
      </p>

      <h2>Fonctionnalités principales</h2>
      <ul>
        <li>Ajouter, compléter et supprimer des tâches</li>
        <li>Suivi automatique de la progression</li>
        <li>Statistiques claires et lisibles</li>
        <li>Responsive design adapté aux mobiles et desktops</li>
        <li>Mode sombre prêt à l’emploi</li>
      </ul>

      <h2>Pourquoi ce projet ?</h2>
      <p>
        Ce projet est un exemple de mes compétences en React et TypeScript, avec
        un design moderne et une architecture propre, prêt pour un portfolio ou
        une présentation à un recruteur.
      </p>
    </div>
  );
}
