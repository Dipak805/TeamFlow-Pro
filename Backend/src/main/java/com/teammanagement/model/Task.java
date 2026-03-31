package com.teammanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    @JsonIgnore
    private Team team;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FileAttachment> attachments = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime completedAt;

    public Task() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status == Status.DONE && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }

    // ===================== GETTERS =====================
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Status getStatus() { return status; }
    public Priority getPriority() { return priority; }
    public LocalDate getDueDate() { return dueDate; }
    public User getAssignedTo() { return assignedTo; }
    public User getCreatedBy() { return createdBy; }
    public Team getTeam() { return team; }
    public List<Comment> getComments() { return comments; }
    public List<FileAttachment> getAttachments() { return attachments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // ===================== SETTERS =====================
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(Status status) { this.status = status; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public void setTeam(Team team) { this.team = team; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
    public void setAttachments(List<FileAttachment> attachments) { this.attachments = attachments; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public enum Status {
        TODO, IN_PROGRESS, REVIEW, DONE
    }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }
}
