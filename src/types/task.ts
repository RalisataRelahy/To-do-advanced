export type TaskStatus = "pending" | "in_progress" | "done" | "archived";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];          // liste de mots-clés
  status: TaskStatus;   // statuts limités
  dueHour?:string;   //heure pour programmer
  priority: TaskPriority;  // priorités limitées
  createdAt: string;       // ISO string
  updatedAt?: string;       // ISO string
  dueDate: string;         // ISO string
}
