package com.teammanagement.dto;
import com.teammanagement.model.Task;
import java.time.LocalDate;

public class UpdateTaskRequest {
    private String title;
    private String description;
    private Long assignedToId;
    private Task.Priority priority;
    private Task.Status status;
    private LocalDate dueDate;

    public UpdateTaskRequest() {}
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
    public Task.Priority getPriority() { return priority; }
    public void setPriority(Task.Priority priority) { this.priority = priority; }
    public Task.Status getStatus() { return status; }
    public void setStatus(Task.Status status) { this.status = status; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
