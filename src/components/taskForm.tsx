import { useState, type FC } from "react";
import "../styles/TaskForm.css";
import type { TaskPriority } from "../types/task";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

interface Props {
  userId: string;
  onAdd?: () => void;
}

const TaskForm: FC<Props> = ({ userId, onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [formError, setFormError] = useState(false);

  const priorityOptions: TaskPriority[] = ["low", "medium", "high", "urgent"];
  const predefinedTags = ["Home", "Study", "Work", "Personal", "Health", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !priority || !dueDate) {
      setFormError(true);
      return;
    }

    setFormError(false);

    const finalTags = [...selectedTags];
    if (customTag.trim() && selectedTags.includes("Other")) {
      finalTags.push(customTag.trim());
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      tags: finalTags,
      dueDate,
      dueHour: dueTime || null,
      priority,
      status: "pending" as const,
      userId,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "tasks"), newTask);
      onAdd?.();

      // Reset
      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("");
      setPriority("");
      setSelectedTags([]);
      setCustomTag("");
    } catch (err) {
      console.error("Erreur ajout tâche :", err);
    }
  };

  const addPredefinedTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = e.target.value;
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags((prev) => [...prev, newTag]);
    }
    e.target.value = ""; // reset select
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
    if (tagToRemove === "Other") {
      setCustomTag("");
    }
  };

  const hasError = formError && !title.trim();

  return (
    <form onSubmit={handleSubmit} className="task-form" noValidate>
      {/* Titre */}
      <div className="form-group title-group">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (formError) setFormError(false);
          }}
          placeholder="Que devez-vous faire ?"
          className={`form-input ${hasError ? "error" : ""}`}
          required
          aria-invalid={hasError}
          aria-describedby={hasError ? "title-error" : undefined}
        />
        {hasError && (
          <span id="title-error" className="error-message">
            Le titre est requis
          </span>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détails, notes... (optionnel)"
          rows={3}
          className="form-input description"
        />
      </div>

      {/* Priorité + Date + Heure */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priorité</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="form-input"
            required
          >
            <option value="">Choisir une priorité</option>
            {priorityOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Date d'échéance</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueTime">Heure (facultatif)</label>
          <input
            id="dueTime"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label>Tags</label>

        <div className="tag-selector-row">
          <select
            onChange={addPredefinedTag}
            className="form-input tag-add-select"
            defaultValue=""
          >
            <option value="" disabled>
              Ajouter un tag...
            </option>
            {predefinedTags
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </select>

          {selectedTags.includes("Other") && (
            <>
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Tag personnalisé"
                className="form-input custom-tag"
              />

              <button
                type="button"
                className="btn-add-custom"
                onClick={addCustomTag}
                disabled={!customTag.trim()}
              >
                Ajouter
              </button>
            </>
          )}
        </div>

        {selectedTags.length > 0 && (
          <div className="selected-tags">
            {selectedTags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => removeTag(tag)}
                  aria-label={`Supprimer le tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button type="submit" className="btn-submit" disabled={!title.trim()}>
        Ajouter la tâche
      </button>
    </form>
  );
};

export default TaskForm;