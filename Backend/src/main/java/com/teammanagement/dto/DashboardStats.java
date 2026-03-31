package com.teammanagement.dto;
import java.util.List;

public class DashboardStats {
    private long totalTeams;
    private long totalUsers;
    private long totalTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long reviewTasks;
    private long doneTasks;
    private long highPriorityTasks;
    private long overdueTasks;
    private List<TaskResponse> recentTasks;
    private List<MemberPerformance> memberPerformances;

    public DashboardStats() {}
    public long getTotalTeams() { return totalTeams; }
    public void setTotalTeams(long totalTeams) { this.totalTeams = totalTeams; }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }
    public long getTodoTasks() { return todoTasks; }
    public void setTodoTasks(long todoTasks) { this.todoTasks = todoTasks; }
    public long getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(long inProgressTasks) { this.inProgressTasks = inProgressTasks; }
    public long getReviewTasks() { return reviewTasks; }
    public void setReviewTasks(long reviewTasks) { this.reviewTasks = reviewTasks; }
    public long getDoneTasks() { return doneTasks; }
    public void setDoneTasks(long doneTasks) { this.doneTasks = doneTasks; }
    public long getHighPriorityTasks() { return highPriorityTasks; }
    public void setHighPriorityTasks(long highPriorityTasks) { this.highPriorityTasks = highPriorityTasks; }
    public long getOverdueTasks() { return overdueTasks; }
    public void setOverdueTasks(long overdueTasks) { this.overdueTasks = overdueTasks; }
    public List<TaskResponse> getRecentTasks() { return recentTasks; }
    public void setRecentTasks(List<TaskResponse> recentTasks) { this.recentTasks = recentTasks; }
    public List<MemberPerformance> getMemberPerformances() { return memberPerformances; }
    public void setMemberPerformances(List<MemberPerformance> memberPerformances) { this.memberPerformances = memberPerformances; }
}
