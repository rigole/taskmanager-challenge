package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.dto.TaskResponse;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
    }

    public List<TaskResponse> getTasks(String email, TaskStatus status, String search) {
        User user = getUserByEmail(email);
        List<Task> tasks;

        if (status != null) {
            tasks = taskRepository.findByUserAndStatus(user, status);
        } else if (search != null && !search.isBlank()) {
            tasks = taskRepository.findByUserAndTitleContainingIgnoreCase(user, search);
        } else {
            tasks = taskRepository.findByUser(user);
        }

        return tasks.stream().map(this::toResponse).toList();
    }

    public TaskResponse createTask(String email, TaskRequest request) {
        User user = getUserByEmail(email);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setUser(user);

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    public TaskResponse updateTask(String email, UUID taskId, TaskRequest request) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new AccessDeniedException("Tâche introuvable ou accès refusé"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        Task updated = taskRepository.save(task);
        return toResponse(updated);
    }

    public void deleteTask(String email, UUID taskId) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new AccessDeniedException("Tâche introuvable ou accès refusé"));

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}