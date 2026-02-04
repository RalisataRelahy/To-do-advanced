import { useState } from "react";
import "../styles/TaskForm.css";

interface Props {
  onAdd: (title: string, description: string, priority: string, tags: string[],dueHour:string) => void;
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [selectPriority, setSelectPriority] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isError, setIsError] = useState(false);

  const priorityOptions = ["urgent", "high", "medium", "low"];
  const tagsOptions = ["Home", "Study", "Love", "Friends", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setIsError(true);
      setTimeout(() => setIsError(false), 300);
      return;
    }

    // Si customTag est rempli, l'ajouter aux tags
    const finalTags = [...selectedTags];
    if (customTag.trim()) {
      finalTags.push(customTag.trim());
      setCustomTag("");
    }

    onAdd(title, description, selectPriority, finalTags,time);

    // Reset
    setTitle("");
    setDescription("");
    setSelectPriority("");
    setSelectedTags([]);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTags(options);
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

      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description..."
        className={isError ? "error" : ""}
        aria-label="Description de la nouvelle tâche"
      />

      <select
        name="priority"
        id="prioritySelect"
        value={selectPriority}
        onChange={e => setSelectPriority(e.target.value)}
      >
        <option value="">--Sélectionner une priorité--</option>
        {priorityOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <select
        id="tags"
        multiple
        value={selectedTags}
        onChange={handleTagChange}
        size={tagsOptions.length}
      >
        {tagsOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* Input pour custom tag si "Other" est sélectionné */}
      {selectedTags.includes("Other") && (
        <div>
          <input
            type="text"
            placeholder="Entrez votre tag"
            value={customTag}
            onChange={e => setCustomTag(e.target.value)}
          />
        </div>
      )}
       <input
        type="time"
        id="reminderTime"
        value={time}
        onChange={e => setTime(e.target.value)}
      />
      <button type="submit" disabled={!title.trim()}>Ajouter</button>
    </form>
  );
}
