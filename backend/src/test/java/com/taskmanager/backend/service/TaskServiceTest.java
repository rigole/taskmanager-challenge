package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.dto.TaskResponse;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User buildUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        return user;
    }

    private Task buildTask(User owner) {
        Task task = new Task();
        task.setId(UUID.randomUUID());
        task.setTitle("Titre existant");
        task.setDescription("Description");
        task.setStatus(TaskStatus.TODO);
        task.setUser(owner);
        return task;
    }

    @Test
    void createTask_returnsTaskResponseWithDefaultStatus() {
        User user = buildUser();
        TaskRequest request = new TaskRequest();
        request.setTitle("Nouvelle tâche");
        request.setDescription("Description");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        TaskResponse response = taskService.createTask("test@test.com", request);

        assertThat(response.getTitle()).isEqualTo("Nouvelle tâche");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
    }

    @Test
    void updateTask_whenTaskBelongsToUser_updatesSuccessfully() {
        User user = buildUser();
        Task existingTask = buildTask(user);

        TaskRequest request = new TaskRequest();
        request.setTitle("Titre modifié");
        request.setDescription("Nouvelle description");
        request.setStatus(TaskStatus.DONE);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUser(existingTask.getId(), user)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(existingTask);

        TaskResponse response = taskService.updateTask("test@test.com", existingTask.getId(), request);

        assertThat(response.getTitle()).isEqualTo("Titre modifié");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.DONE);
    }

    @Test
    void updateTask_whenTaskBelongsToAnotherUser_throwsAccessDenied() {
        User user = buildUser();
        UUID taskId = UUID.randomUUID();
        TaskRequest request = new TaskRequest();
        request.setTitle("Peu importe");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUser(taskId, user)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask("test@test.com", taskId, request))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void deleteTask_whenTaskBelongsToAnotherUser_throwsAccessDenied() {
        User user = buildUser();
        UUID taskId = UUID.randomUUID();

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUser(taskId, user)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask("test@test.com", taskId))
                .isInstanceOf(AccessDeniedException.class);

        verify(taskRepository, never()).delete(any());
    }

    @Test
    void getTasks_withStatusFilter_callsCorrectRepositoryMethod() {
        User user = buildUser();
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByUserAndStatus(user, TaskStatus.DONE)).thenReturn(List.of(buildTask(user)));

        List<TaskResponse> results = taskService.getTasks("test@test.com", TaskStatus.DONE, null);

        assertThat(results).hasSize(1);
        verify(taskRepository).findByUserAndStatus(user, TaskStatus.DONE);
        verify(taskRepository, never()).findByUser(any());
    }
}