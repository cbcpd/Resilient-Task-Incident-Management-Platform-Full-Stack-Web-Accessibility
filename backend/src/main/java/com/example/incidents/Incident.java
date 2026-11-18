package com.example.incidents;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_incident_status_created", columnList = "status, created_at"),
    @Index(name = "idx_incident_priority", columnList = "priority")
})
public class Incident {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 140)
    private String title;
    @Column(nullable = false, length = 4000)
    private String description;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private IncidentPriority priority;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private IncidentStatus status;
    @Column(length = 120)
    private String assignee;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist void onCreate() { createdAt = Instant.now(); updatedAt = createdAt; }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String v) { title = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { description = v; }
    public IncidentPriority getPriority() { return priority; }
    public void setPriority(IncidentPriority v) { priority = v; }
    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus v) { status = v; }
    public String getAssignee() { return assignee; }
    public void setAssignee(String v) { assignee = v; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
