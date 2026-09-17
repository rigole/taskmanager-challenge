package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.dto.TaskResponse;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            Authentication authentication,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String search) {

        String email = authentication.getName();
        return ResponseEntity.ok(taskService.getTasks(email, status, search));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            Authentication authentication,
            @Valid @RequestBody TaskRequest request) {

        String email = authentication.getName();
        TaskResponse response = taskService.createTask(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody TaskRequest request) {

        String email = authentication.getName();
        return ResponseEntity.ok(taskService.updateTask(email, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            Authentication authentication,
            @PathVariable UUID id) {

        String email = authentication.getName();
        taskService.deleteTask(email, id);
        return ResponseEntity.noContent().build();
    }
}