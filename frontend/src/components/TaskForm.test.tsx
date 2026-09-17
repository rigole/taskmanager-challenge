import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TaskForm from "./TaskForm";

describe("TaskForm", () => {
  it("appelle onCreate avec le titre et la description saisis", async () => {
    const onCreate = vi.fn();
    const user = userEvent.setup();

    render(<TaskForm onCreate={onCreate} />);

    await user.type(screen.getByPlaceholderText("Nouvelle tâche..."), "Ma tâche");
    await user.type(screen.getByPlaceholderText("Description (optionnel)"), "Ma description");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onCreate).toHaveBeenCalledWith("Ma tâche", "Ma description");
  });

  it("ne fait rien si le titre est vide", async () => {
    const onCreate = vi.fn();
    const user = userEvent.setup();

    render(<TaskForm onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onCreate).not.toHaveBeenCalled();
  });

  it("vide les champs après soumission", async () => {
    const onCreate = vi.fn();
    const user = userEvent.setup();

    render(<TaskForm onCreate={onCreate} />);

    const titleInput = screen.getByPlaceholderText("Nouvelle tâche...");
    await user.type(titleInput, "Ma tâche");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(titleInput).toHaveValue("");
  });
});