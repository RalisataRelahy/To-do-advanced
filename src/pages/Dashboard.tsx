import { useEffect, useCallback } from "react";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import {  db } from "../services/firebase";

import type { Task } from "../types/task";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getStats } from "../utils/stats";

import TaskForm from "../components/taskForm";
import TaskItem from "../components/taskItem";
import StatsChart from "../components/statsCard";
import ProgressBar from "../components/progressBar";

import "../styles/Dahsboard.css";

interface DashboardProps {
  user: { uid: string;[key: string]: any } | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);

  // Si l'utilisateur n'est pas connecté → on ne fait rien
  if (!user?.uid) {
    return <div className="dashboard-error">Utilisateur non connecté</div>;
  }

  const daysMap = [1, 2, 3, 4, 5, 6, 0]; // Lundi → Dimanche

  const completedByDay = daysMap.map((dayNum) =>
    tasks.filter((t) => t.status === "done" && new Date(t.createdAt).getDay() === dayNum).length
  );

  const totalByDay = daysMap.map((dayNum) =>
    tasks.filter((t) => new Date(t.createdAt).getDay() === dayNum).length
  );

  // ────────────────────────────────────────────────
  // Chargement des tâches depuis Firestore
  // ────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des tâches :", err);
    }
  }, [user?.uid, setTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ────────────────────────────────────────────────
  // Actions sur les tâches
  // ────────────────────────────────────────────────
  const toggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const newStatus = task.status === "done" ? "pending" : "done";

      try {
        await updateDoc(doc(db, "tasks", id), {
          status: newStatus,
          updatedAt: new Date().toISOString(), // bonus : on peut suivre la dernière modif
        });

        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      } catch (err) {
        console.error("Erreur lors du toggle de la tâche :", err);
      }
    },
    [tasks, setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      // Note : ici on ne supprime pas dans Firestore
      // → à ajouter si tu veux une vraie suppression :
      deleteDoc(doc(db, "tasks", id));
    },
    [setTasks]
  );

  const stats = getStats(tasks);

  const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Mes tâches</h1>
      </header>

      <section className="stats-section">
        <div className="stat-container">
          <StatsChart
            labels={labels}
            completedData={completedByDay}
            totalData={totalByDay}
          />
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <span className="label">Total: </span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-item">
            <span className="label">Terminées: </span>
            <strong>{stats.completed}</strong>
          </div>
          <div className="stat-item progress-item">
            <span className="label">Progression :</span>
            <ProgressBar progress={stats.progress} />
          </div>
        </div>
      </section>

      <section className="task-form-section">
        <TaskForm userId={user.uid} onAdd={fetchTasks} />
      </section>

      <section className="tasks-section">
        {tasks.length === 0 ? (
          <p className="no-tasks">Aucune tâche pour le moment…</p>
        ) : (
          <div className="table-wrapper">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>Aucune tâche pour le moment</p>
                <small>Ajoutez votre première tâche ci-dessus !</small>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th className="col-check">Fait</th>
                    <th className="col-title">Tâche</th>
                    <th className="col-date">Échéance</th>
                    <th className="col-priority">Priorité</th>
                    <th className="col-tags">Tags</th>
                    <th className="col-desc">Description</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </div>
  );
}