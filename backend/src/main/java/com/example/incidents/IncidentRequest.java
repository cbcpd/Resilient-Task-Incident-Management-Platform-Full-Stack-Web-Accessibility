package com.example.incidents;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IncidentRequest(
    @NotBlank @Size(max = 140) String title,
    @NotBlank @Size(max = 4000) String description,
    @NotNull IncidentPriority priority,
    @NotNull IncidentStatus status,
    @Size(max = 120) String assignee
) {}
