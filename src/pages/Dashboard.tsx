import type{ Task } from "../types/task";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TaskForm from "../components/taskForm";
import TaskItem from "../components/taskItem";
import { getStats } from "../utils/stats";
import "../styles/Dahsboard.css";
import StatsChart from "../components/statsCard";
import ProgressBar from "../components/progressBar";

interface DashProps{
  user:any;
}
export default function Dashboard({user}:DashProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const daysMap = [1, 2, 3, 4, 5, 6, 0]; // Lundi=1 ... Dimanche=0

const completedByDay = daysMap.map(dayNum =>
  tasks.filter(t => t.status==="done"&& new Date(t.createdAt).getDay() === dayNum).length
);

const totalByDay = daysMap.map(dayNum =>
  tasks.filter(t => new Date(t.createdAt).getDay() === dayNum).length
);



  const addTask = (title: string) => {
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title,
        status: "pending",

        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const stats = getStats(tasks);

  return (
    <div className="dashboard">
        <div className="stat-container">
           <StatsChart
  labels={["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]}
  completedData={completedByDay}
  totalData={totalByDay}
/>

        </div>
        
      <div className="stats-summary">
        <p>Total: {stats.total}</p>
        <p>Complétées: {stats.completed}</p>
        <div className="progress"><p> Progression:</p><ProgressBar progress={stats.progress} /></div>
      </div>

      <TaskForm onAdd={addTask} />
      <div className="table-wrapper">
            <table className="dashboard-table">
            <thead>
                <tr>
                <th>Marquer fait</th>
                <th>Titres</th>
                <th>Date</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                <TaskItem
                    key={task.id} // obligatoire pour React
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                />
                ))}
            </tbody>
        </table>

      </div>
        
          </div>
  );
}
