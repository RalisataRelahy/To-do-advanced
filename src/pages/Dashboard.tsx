import { useEffect, useState, useMemo, useCallback } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  // orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";

import type { Task, TaskPriority, TaskStatus } from "../types/task";

import TaskForm from "../components/taskForm";
import TaskItem from "../components/taskItem";
import StatsChart from "../components/statsCard";
import ProgressBar from "../components/progressBar";

import "../styles/Dahsboard.css";

// ────────────────────────────────────────────────
// Types & Constants
// ────────────────────────────────────────────────
type SortField = "priority" | "dueDate" | null;

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
// const DAY_INDEXES = [1, 2, 3, 4, 5, 6, 0]; // lundi à dimanche

interface DashboardProps {
  user: {
    uid: string;
    email?: string;
  } | null;
}

// ────────────────────────────────────────────────
// Utils
// ────────────────────────────────────────────────
const getDayOfWeek = (timestamp: any): number | null => {
  if (!timestamp) return null;

  let date: Date;

  if ("seconds" in timestamp && "nanoseconds" in timestamp) {
    // Firestore Timestamp
    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  if (Number.isNaN(date.getTime())) return null;
  const day = date.getDay();
  return day === 0 ? 6 : day - 1; // 0 = dimanche → 6, 1 = lundi → 0, etc.
};

const calculateWeeklyStats = (tasks: Task[]) => {
  const completedByDay = new Array(7).fill(0);
  const totalByDay = new Array(7).fill(0);

  tasks.forEach((task) => {
    const dayIndex = getDayOfWeek(task.createdAt);
    if (dayIndex === null) return;

    totalByDay[dayIndex] += 1;
    if (task.status === "done") {
      completedByDay[dayIndex] += 1;
    }
  });

  return { completedByDay, totalByDay };
};

const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, progress };
};

// ────────────────────────────────────────────────
// Composant principal
// ────────────────────────────────────────────────
export default function Dashboard({ user }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>(null);

  if (!user?.uid) {
    return <div className="dashboard-error">Utilisateur non connecté</div>;
  }

  // ── Chargement des tâches ────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
        // orderBy("createdAt", "desc") // optionnel : ordre chronologique inverse
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(data);
    } catch (err: any) {
      console.error("Erreur lors du chargement des tâches :", err);
      setError("Impossible de charger les tâches. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Actions sur les tâches ───────────────────────────────
  const toggleTaskStatus = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newStatus: TaskStatus = task.status === "done" ? "pending" : "done";

      try {
        await updateDoc(doc(db, "tasks", taskId), {
          status: newStatus,
          updatedAt: new Date(),
        });

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          )
        );
      } catch (err) {
        console.error("Erreur lors du changement de statut :", err);
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        await deleteDoc(doc(db, "tasks", taskId));
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    },
    []
  );

  // ── Tri des tâches ────────────────────────────────────────
  const sortedTasks = useMemo(() => {
    if (!sortBy) return tasks;

    return [...tasks].sort((a, b) => {
      if (sortBy === "priority") {
        const prioA = PRIORITY_ORDER[a.priority] ?? 0;
        const prioB = PRIORITY_ORDER[b.priority] ?? 0;
        return prioB - prioA; // urgent en premier
      }

      if (sortBy === "dueDate") {
        // Tâches sans date → fin de liste
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      return 0;
    });
  }, [tasks, sortBy]);

  // ── Statistiques (mémorisées) ─────────────────────────────
  const { completedByDay, totalByDay } = useMemo(
    () => calculateWeeklyStats(tasks),
    [tasks]
  );

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  // ── Rendu ─────────────────────────────────────────────────
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Mes tâches</h1>
      </header>

      <section className="stats-section">
        <StatsChart
          labels={DAYS_OF_WEEK}
          completedData={completedByDay}
          totalData={totalByDay}
        />

        <div className="stats-summary">
          <div>
            Total : <strong>{stats.total}</strong>
          </div>
          <div>
            Terminées : <strong>{stats.completed}</strong>
          </div>
          <ProgressBar progress={stats.progress} />
        </div>
      </section>

      <TaskForm userId={user.uid} onAdd={fetchTasks} />

      <section className="tasks-section">
        {loading ? (
          <div className="loading-state">Chargement des tâches...</div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchTasks} className="btn-retry">
              Réessayer
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>Aucune tâche pour le moment</p>
            <small>Commencez par en ajouter une ci-dessus !</small>
          </div>
        ) : (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>✔</th>
                  <th>Tâche</th>
                  <th
                    onClick={() => setSortBy((prev) => (prev === "dueDate" ? null : "dueDate"))}
                    className={sortBy === "dueDate" ? "sortable active" : "sortable"}
                  >
                    Échéance ↓↑
                  </th>
                  <th
                    onClick={() => setSortBy((prev) => (prev === "priority" ? null : "priority"))}
                    className={sortBy === "priority" ? "sortable active" : "sortable"}
                  >
                    Priorité ↓↑
                  </th>
                  <th>Tags</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskStatus}
                    onDelete={deleteTask}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}