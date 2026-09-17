package com.taskmanager.backend.dto;

import com.taskmanager.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    private String description;

    private TaskStatus status;
}