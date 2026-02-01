import { useState } from "react";
import "../styles/TaskForm.css";

interface Props {
  onAdd: (title: string) => void;
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setIsError(true);
      setTimeout(() => setIsError(false), 300);
      return;
    }
    
    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => {
          setTitle(e.target.value);
          setIsError(false);
        }}
        placeholder="Nouvelle tâche..."
        className={isError ? "error" : ""}
        aria-label="Titre de la nouvelle tâche"
      />
      <button 
        type="submit"
        disabled={!title.trim()}
      >
        Ajouter
      </button>
    </form>
  );
}