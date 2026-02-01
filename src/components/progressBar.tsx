// import React from "react";
import "../styles/Progress-bar.css"
interface ProgressBarProps {
  progress: number; // 0 à 100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="progress-bar-wrapper">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="progress-label">{progress}%</span>
    </div>
  );
}
