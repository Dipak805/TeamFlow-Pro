package com.teammanagement.dto;
import com.teammanagement.model.Task;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private LocalDate dueDate;
    private UserSummary assignedTo;
    private UserSummary createdBy;
    private Long teamId;
    private String teamName;
    private List<CommentResponse> comments;
    private List<FileResponse> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean overdue;

    public TaskResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Task.Status getStatus() { return status; }
    public void setStatus(Task.Status status) { this.status = status; }
    public Task.Priority getPriority() { return priority; }
    public void setPriority(Task.Priority priority) { this.priority = priority; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public UserSummary getAssignedTo() { return assignedTo; }
    public void setAssignedTo(UserSummary assignedTo) { this.assignedTo = assignedTo; }
    public UserSummary getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserSummary createdBy) { this.createdBy = createdBy; }
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public List<CommentResponse> getComments() { return comments; }
    public void setComments(List<CommentResponse> comments) { this.comments = comments; }
    public List<FileResponse> getAttachments() { return attachments; }
    public void setAttachments(List<FileResponse> attachments) { this.attachments = attachments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public boolean isOverdue() { return overdue; }
    public void setOverdue(boolean overdue) { this.overdue = overdue; }
}
