import apiClient from "./client";
import type { Task, TaskRequest, TaskStatus } from "../types/task";

export const getTasks = async (status?: TaskStatus, search?: string): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>("/tasks", {
    params: { status, search },
  });
  return response.data;
};

export const createTask = async (data: TaskRequest): Promise<Task> => {
  const response = await apiClient.post<Task>("/tasks", data);
  return response.data;
};

export const updateTask = async (id: string, data: TaskRequest): Promise<Task> => {
  const response = await apiClient.put<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};