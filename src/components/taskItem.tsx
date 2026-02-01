import type { Task } from "../types/task";
import { formatDate } from "../utils/formateDate";
import '../styles/taskItem.css';
interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
<tr className={task.completed ? "done" : ""}>
  <td data-label="Fait ?">
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => onToggle(task.id)}
    />
  </td>

  <td data-label="Tâche">
    <span className="task-title">{task.title}</span>
  </td>

  <td data-label="Date">
    <span>{formatDate(task.createdAt)}</span>
  </td>

  <td data-label="Actions">
    <button onClick={() => onDelete(task.id)} className="btn">
      🗑
    </button>
  </td>
</tr>

  );
}
