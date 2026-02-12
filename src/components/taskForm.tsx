import { useState, type FC } from "react";
import "../styles/TaskForm.css";
import "../styles/modale.css";
import type { TaskPriority } from "../types/task";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import Modal from "./infoModule";

interface Props {
  userId: string;
  onAdd?: () => void;
}

const TaskForm: FC<Props> = ({ userId, onAdd }) => {
  // ── États du formulaire ───────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  // ── États pour la gestion des erreurs et feedback ─────────────
  const [errors, setErrors] = useState<{
    title?: string;
    priority?: string;
    dueDate?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const priorityOptions: TaskPriority[] = ["low", "medium", "high", "urgent"];
  const predefinedTags = ["Home", "Study", "Work", "Personal", "Health", "Other"];

  // ── Validation du formulaire ─────────────────────────────────
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Le titre est obligatoire";
    }

    if (!priority) {
      newErrors.priority = "Veuillez choisir une priorité";
    }

    if (!dueDate) {
      newErrors.dueDate = "La date d'échéance est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Soumission du formulaire ─────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    // Préparation des tags
    let finalTags = [...selectedTags];
    if (selectedTags.includes("Other") && customTag.trim()) {
      finalTags = [...finalTags, customTag.trim()];
    }

    const newTask = {
      title: title.trim(),
      description: description.trim() || null,
      tags: finalTags,
      dueDate,                    // Format "YYYY-MM-DD"
      dueHour: dueTime || null,   // Format "HH:mm" ou null
      priority,
      status: "pending" as const,
      userId,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "tasks"), newTask);

      // Reset formulaire
      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("");
      setPriority("");
      setSelectedTags([]);
      setCustomTag("");
      setErrors({});

      onAdd?.();
    } catch (err) {
      console.error("Erreur lors de l'ajout de la tâche :", err);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Gestion des tags prédéfinis ──────────────────────────────
  const handleAddPredefinedTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    e.target.value = ""; // reset
  };

  // ── Gestion du tag personnalisé ──────────────────────────────
  const handleAddCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
    // Si on supprime "Other", on vide aussi le champ custom
    if (tagToRemove === "Other") {
      setCustomTag("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form" noValidate>
      <h1>Ajouter une tâche</h1>

      {/* Titre */}
      <div className="form-group">
        <label htmlFor="title">Titre *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="Que devez-vous faire ?"
          className={`form-input ${errors.title ? "error" : ""}`}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <span id="title-error" className="error-message">
            {errors.title}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détails, notes, contexte... (facultatif)"
          rows={4}
          className="form-input description"
        />
      </div>

      {/* Priorité - Date - Heure */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priorité *</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as TaskPriority);
              if (errors.priority) setErrors((prev) => ({ ...prev, priority: undefined }));
            }}
            className={`form-input ${errors.priority ? "error" : ""}`}
            aria-invalid={!!errors.priority}
          >
            <option value="">Choisir une priorité</option>
            {priorityOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          {errors.priority && (
            <span className="error-message">{errors.priority}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Date d'échéance *</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
            }}
            className={`form-input ${errors.dueDate ? "error" : ""}`}
            aria-invalid={!!errors.dueDate}
          />
          {errors.dueDate && (
            <span className="error-message">{errors.dueDate}</span>
          )}
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
            onChange={handleAddPredefinedTag}
            className="form-input tag-add-select"
            defaultValue=""
          >
            <option value="" disabled>
              Ajouter un tag prédéfini...
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
            <div className="custom-tag-wrapper">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Entrez un tag personnalisé"
                className="form-input custom-tag"
              />
              <button
                type="button"
                className="btn-add-custom"
                onClick={handleAddCustomTag}
                disabled={!customTag.trim() || isSubmitting}
              >
                Ajouter
              </button>
            </div>
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

      {/* Bouton de soumission */}
      <button
        type="submit"
        className="btn-submit"
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? "Ajout en cours..." : "Ajouter la tâche"}
      </button>

      {/* Modal d'erreur Firebase */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erreur d'ajout"
      >
        <p>Une erreur est survenue lors de l'enregistrement de la tâche.</p>
        <p>Veuillez réessayer ou vérifier votre connexion.</p>
      </Modal>
    </form>
  );
};

export default TaskForm;