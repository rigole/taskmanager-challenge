import { useState } from "react";
import type { FormEvent } from "react";
interface TaskFormProps {
  onCreate: (title: string, description: string) => void;
}

export default function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-b border-white/10 pb-4">
      <input
        placeholder="Nouvelle tâche..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent"
      />
      <input
        placeholder="Description (optionnel)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-1 rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent"
      />
      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90"
      >
        Ajouter
      </button>
    </form>
  );
}