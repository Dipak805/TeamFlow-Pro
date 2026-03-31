package com.teammanagement.dto;

public class MemberPerformance {
    private Long userId;
    private String fullName;
    private String username;
    private long assignedTasks;
    private long completedTasks;
    private double completionRate;

    public MemberPerformance() {}
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public long getAssignedTasks() { return assignedTasks; }
    public void setAssignedTasks(long assignedTasks) { this.assignedTasks = assignedTasks; }
    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }
    public double getCompletionRate() { return completionRate; }
    public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
}
