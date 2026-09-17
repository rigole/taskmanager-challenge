import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TaskRow from "./TaskRow";
import type { Task } from "../types/task";

const buildTask = (overrides: Partial<Task> = {}): Task => ({
  id: "1",
  title: "Tâche de test",
  description: "Description de test",
  status: "TODO",
  createdAt: "2026-09-17T10:00:00",
  updatedAt: "2026-09-17T10:00:00",
  ...overrides,
});

describe("TaskRow", () => {
  it("affiche le titre et la description de la tâche", () => {
    render(<TaskRow task={buildTask()} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Tâche de test")).toBeInTheDocument();
    expect(screen.getByText("Description de test")).toBeInTheDocument();
  });

  it("appelle onDelete avec l'id de la tâche au clic sur Supprimer", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    const task = buildTask({ id: "abc-123" });

    render(<TaskRow task={task} onUpdate={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByText("Supprimer"));

    expect(onDelete).toHaveBeenCalledWith("abc-123");
  });

  it("affiche 'Terminée le' quand le statut est DONE", () => {
    const task = buildTask({ status: "DONE" });

    render(<TaskRow task={task} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/Terminée le/)).toBeInTheDocument();
  });

  it("passe en mode édition au clic sur Éditer", async () => {
    const user = userEvent.setup();

    render(<TaskRow task={buildTask()} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    await user.click(screen.getByText("Éditer"));

    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument();
  });

  it("appelle onUpdate avec le nouveau statut choisi", async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();
    const task = buildTask({ id: "1", title: "Test", description: "Desc" });

    render(<TaskRow task={task} onUpdate={onUpdate} onDelete={vi.fn()} />);

    await user.selectOptions(screen.getByRole("combobox"), "DONE");

    expect(onUpdate).toHaveBeenCalledWith("1", "Test", "Desc", "DONE");
  });
});