package com.teammanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Notification() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ===================== GETTERS =====================
    public Long getId() { return id; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public User getUser() { return user; }
    public Task getTask() { return task; }
    public boolean isRead() { return isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ===================== SETTERS =====================
    public void setId(Long id) { this.id = id; }
    public void setMessage(String message) { this.message = message; }
    public void setType(String type) { this.type = type; }
    public void setUser(User user) { this.user = user; }
    public void setTask(Task task) { this.task = task; }
    public void setRead(boolean isRead) { this.isRead = isRead; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
