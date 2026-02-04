import type { Task } from "../types/task";

export function getStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status==="done").length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, progress };
}
