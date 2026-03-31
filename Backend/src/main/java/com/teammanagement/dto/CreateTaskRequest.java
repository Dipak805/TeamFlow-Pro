package com.teammanagement.dto;
import com.teammanagement.model.Task;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class CreateTaskRequest {
    @NotBlank private String title;
    private String description;
    @NotNull private Long assignedToId;
    private Task.Priority priority = Task.Priority.MEDIUM;
    private LocalDate dueDate;

    public CreateTaskRequest() {}
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
    public Task.Priority getPriority() { return priority; }
    public void setPriority(Task.Priority priority) { this.priority = priority; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
