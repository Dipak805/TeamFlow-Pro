package com.teammanagement.service;

import com.teammanagement.dto.*;
import com.teammanagement.model.Task;
import com.teammanagement.model.User;
import com.teammanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private TeamRepository teamRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TaskService taskService;

    public DashboardStats getManagerDashboard() {
        long totalTeams = teamRepository.countByActiveTrue();
        long totalUsers = userRepository.count();
        long totalTasks = taskRepository.count();
        long todo = taskRepository.countByStatus(Task.Status.TODO);
        long inProgress = taskRepository.countByStatus(Task.Status.IN_PROGRESS);
        long review = taskRepository.countByStatus(Task.Status.REVIEW);
        long done = taskRepository.countByStatus(Task.Status.DONE);
        long highPriority = taskRepository.countByPriority(Task.Priority.HIGH);
        long overdue = taskRepository.findOverdueTasks(LocalDate.now()).size();

        List<TaskResponse> recent = taskRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(taskService::toResponse)
                .collect(Collectors.toList());

        List<MemberPerformance> performances = userRepository.findByRole(User.Role.MEMBER)
                .stream().map(this::toPerformance).collect(Collectors.toList());

        DashboardStats stats = new DashboardStats();
        stats.setTotalTeams(totalTeams);
        stats.setTotalUsers(totalUsers);
        stats.setTotalTasks(totalTasks);
        stats.setTodoTasks(todo);
        stats.setInProgressTasks(inProgress);
        stats.setReviewTasks(review);
        stats.setDoneTasks(done);
        stats.setHighPriorityTasks(highPriority);
        stats.setOverdueTasks(overdue);
        stats.setRecentTasks(recent);
        stats.setMemberPerformances(performances);
        return stats;
    }

    public DashboardStats getTeamLeadDashboard(Long teamId) {
        long totalTasks = taskRepository.findByTeamId(teamId).size();
        long todo = taskRepository.countByTeamIdAndStatus(teamId, Task.Status.TODO);
        long inProgress = taskRepository.countByTeamIdAndStatus(teamId, Task.Status.IN_PROGRESS);
        long review = taskRepository.countByTeamIdAndStatus(teamId, Task.Status.REVIEW);
        long done = taskRepository.countByTeamIdAndStatus(teamId, Task.Status.DONE);

        List<TaskResponse> recent = taskRepository.findByTeamId(teamId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(taskService::toResponse)
                .collect(Collectors.toList());

        List<MemberPerformance> performances = userRepository.findMembersByTeamId(teamId)
                .stream().map(this::toPerformance).collect(Collectors.toList());

        DashboardStats stats = new DashboardStats();
        stats.setTotalTasks(totalTasks);
        stats.setTodoTasks(todo);
        stats.setInProgressTasks(inProgress);
        stats.setReviewTasks(review);
        stats.setDoneTasks(done);
        stats.setRecentTasks(recent);
        stats.setMemberPerformances(performances);
        return stats;
    }

    private MemberPerformance toPerformance(User user) {
        long assigned = taskRepository.findByAssignedToId(user.getId()).size();
        long completed = taskRepository.countCompletedTasksByUser(user.getId());
        double rate = assigned > 0 ? (double) completed / assigned * 100 : 0;

        MemberPerformance p = new MemberPerformance();
        p.setUserId(user.getId());
        p.setFullName(user.getFullName());
        p.setUsername(user.getUsername());
        p.setAssignedTasks(assigned);
        p.setCompletedTasks(completed);
        p.setCompletionRate(rate);
        return p;
    }
}
