package com.taskmanager.backend.repository;

import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByUser(User user);

    List<Task> findByUserAndStatus(User user, TaskStatus status);

    List<Task> findByUserAndTitleContainingIgnoreCase(User user, String keyword);

    Optional<Task> findByIdAndUser(UUID id, User user);
}
