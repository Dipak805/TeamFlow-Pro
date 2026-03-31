package com.teammanagement.dto;
import java.time.LocalDateTime;
import java.util.List;

public class TeamResponse {
    private Long id;
    private String name;
    private String description;
    private UserSummary teamLead;
    private List<UserSummary> members;
    private int totalTasks;
    private int completedTasks;
    private LocalDateTime createdAt;

    public TeamResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public UserSummary getTeamLead() { return teamLead; }
    public void setTeamLead(UserSummary teamLead) { this.teamLead = teamLead; }
    public List<UserSummary> getMembers() { return members; }
    public void setMembers(List<UserSummary> members) { this.members = members; }
    public int getTotalTasks() { return totalTasks; }
    public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }
    public int getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
