import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import type { Task, TaskStatus } from "../types/task";
import TaskRow from "../components/TaskRow";
import TaskForm from "../components/TaskForm";

const filters: { label: string; value: TaskStatus | "ALL" }[] = [
  { label: "Toutes", value: "ALL" },
  { label: "À faire", value: "TODO" },
  { label: "En cours", value: "IN_PROGRESS" },
  { label: "Terminées", value: "DONE" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const { email, logout } = useAuth();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const status = activeFilter === "ALL" ? undefined : activeFilter;
      const data = await getTasks(status, search || undefined);
      setTasks(data);
    } catch {
      toast.error("Impossible de charger les tâches");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchTasks, 300); 
    return () => clearTimeout(timeout);
  }, [fetchTasks]);

  const handleCreate = async (title: string, description: string) => {
    try {
      const newTask = await createTask({ title, description });
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Tâche créée");
    } catch {
      toast.error("Impossible de créer la tâche");
    }
  };

  const handleUpdate = async (id: string, title: string, description: string, status: TaskStatus) => {
    try {
      const updated = await updateTask(id, { title, description, status });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      toast.error("Impossible de mettre à jour la tâche");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tâche supprimée");
    } catch {
      toast.error("Impossible de supprimer la tâche");
    }
  };

  return (
    <div className="min-h-screen bg-bg px-6 py-10 md:px-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text">Tâches</h1>
            <p className="mt-1 text-sm text-text/50">{email}</p>
          </div>
          <button onClick={logout} className="text-sm text-text/50 hover:text-accent">
            Déconnexion
          </button>
        </div>

        <div className="mt-8">
          <TaskForm onCreate={handleCreate} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activeFilter === f.value
                    ? "bg-accent text-bg"
                    : "text-text/50 hover:text-text"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto rounded-md border border-white/10 bg-surface px-3 py-1.5 text-xs text-text outline-none focus:border-accent"
          />
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="py-8 text-center text-sm text-text/40">Chargement...</p>
          ) : tasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-text/40">Aucune tâche pour le moment.</p>
          ) : (
            tasks.map((task) => (
              <TaskRow key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}