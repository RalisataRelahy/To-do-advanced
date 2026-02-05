import type { Task } from "../types/task";
import { formatDate } from "../utils/formateDate"; // Attention : formateDate ou formatDate ?
import "../styles/taskItem.css";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const isDone = task.status === "done";

  // On prépare l'affichage des tags
  // const tagsDisplay = task.tags?.length > 0 ? task.tags.join(", ") : "—";

  return (
    <tr className={isDone ? "done" : ""}>
      {/* Checkbox - Marquer comme fait */}
      <td data-label="Fait ?" className="checkbox-cell">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => onToggle(task.id)}
          aria-label={isDone ? "Marquer comme non terminé" : "Marquer comme terminé"}
        />
      </td>

      {/* Titre */}
      <td data-label="Tâche" className="task-title-cell">
        <span className="task-title">{task.title}</span>
      </td>

      {/* Date de création ou d'échéance ? */}
      <td data-label="Date">
        <span className="date-text">
          {task.dueDate
            ? formatDate(task.dueDate) // ← si tu as une date d'échéance
            : formatDate(task.createdAt)}
        </span>
        {task.dueHour && <span className="due-hour"> à {task.dueHour}</span>}
      </td>

      {/* Priorité */}
      <td data-label="Priorité">
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority === "low" ? "Basse"
            : task.priority === "medium" ? "Moyenne"
            : task.priority === "high" ? "Haute"
            : "Urgente"}
        </span>
      </td>

      {/* Tags */}
      <td data-label="Tags">
        <div className="tags-container">
          {task.tags?.length > 0 ? (
            task.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))
          ) : (
            <span className="no-tags">—</span>
          )}
        </div>
      </td>
          {/*Description */}
      <td data-label="Description">
        <div className="tags-container">
          {task.description?.length > 0 ? (
            <span>{task.description}</span>
          ) : (
            <span className="no-tags">—</span>
          )}
        </div>
      </td>
      {/* Actions */}
      <td data-label="Actions" className="actions-cell">
        <button
          onClick={() => onDelete(task.id)}
          className="btn-delete"
          aria-label="Supprimer la tâche"
          title="Supprimer"
        >
          🗑
        </button>
      </td>
    </tr>
  );
}