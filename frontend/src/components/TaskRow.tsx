import { useState } from "react";
import type { Task, TaskStatus } from "../types/task";

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  TODO: { label: "À faire", color: "bg-text/40" },
  IN_PROGRESS: { label: "En cours", color: "bg-warning" },
  DONE: { label: "Terminé", color: "bg-success" },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface TaskRowProps {
  task: Task;
  onUpdate: (id: string, title: string, description: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskRow({ task, onUpdate, onDelete }: TaskRowProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const handleStatusChange = (status: TaskStatus) => {
    onUpdate(task.id, task.title, task.description || "", status);
  };

  const saveEdit = () => {
    onUpdate(task.id, title, description, task.status);
    setEditing(false);
  };

  const wasEdited = task.updatedAt !== task.createdAt;

  return (
    <div className="flex items-start gap-3 border-b border-white/5 py-3">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusConfig[task.status].color}`} />

      <div className="flex-1">
        {editing ? (
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-bg px-2 py-1 text-sm text-text outline-none focus:border-accent"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-white/10 bg-bg px-2 py-1 text-sm text-text outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <button onClick={saveEdit} className="text-xs font-medium text-accent hover:underline">
                Enregistrer
              </button>
              <button onClick={() => setEditing(false)} className="text-xs text-text/50 hover:underline">
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-text">{task.title}</p>
            {task.description && (
              <p className="mt-0.5 text-xs text-text/50">{task.description}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text/40">
              <span>Créée le {formatDate(task.createdAt)}</span>
              {wasEdited && task.status !== "DONE" && (
                <span>Modifiée le {formatDate(task.updatedAt)}</span>
              )}
              {task.status === "DONE" && (
                <span className="text-success">Terminée le {formatDate(task.updatedAt)}</span>
              )}
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className="flex shrink-0 items-center gap-3">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className="rounded-md border border-white/10 bg-surface px-2 py-1 text-xs text-text outline-none focus:border-accent"
          >
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminé</option>
          </select>

          <button onClick={() => setEditing(true)} className="text-xs text-text/50 hover:text-accent">
            Éditer
          </button>
          <button onClick={() => onDelete(task.id)} className="text-xs text-text/50 hover:text-red-400">
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}