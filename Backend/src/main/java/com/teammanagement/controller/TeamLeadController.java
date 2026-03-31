package com.teammanagement.controller;

import com.teammanagement.dto.*;
import com.teammanagement.model.User;
import com.teammanagement.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teamlead")
@PreAuthorize("hasAnyRole('TEAM_LEAD','MANAGER')")
public class TeamLeadController {

    @Autowired private TaskService taskService;
    @Autowired private TeamService teamService;
    @Autowired private DashboardService dashboardService;
    @Autowired private AuthService authService;

    @GetMapping("/my-team")
    public ResponseEntity<TeamResponse> getMyTeam() {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(teamService.getTeamByLeadId(current.getId()));
    }

    @GetMapping("/my-team/members")
    public ResponseEntity<List<UserSummary>> getTeamMembers() {
        User current = authService.getCurrentUser();
        TeamResponse team = teamService.getTeamByLeadId(current.getId());
        return ResponseEntity.ok(teamService.getTeamMembers(team.getId()));
    }

    @PostMapping("/my-team/members/{userId}")
    public ResponseEntity<ApiResponse> addMember(@PathVariable Long userId) {
        User current = authService.getCurrentUser();
        TeamResponse team = teamService.getTeamByLeadId(current.getId());
        return ResponseEntity.ok(teamService.addMemberToTeam(team.getId(), userId));
    }

    @DeleteMapping("/my-team/members/{userId}")
    public ResponseEntity<ApiResponse> removeMember(@PathVariable Long userId) {
        User current = authService.getCurrentUser();
        TeamResponse team = teamService.getTeamByLeadId(current.getId());
        return ResponseEntity.ok(teamService.removeMemberFromTeam(team.getId(), userId));
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getTeamTasks() {
        User current = authService.getCurrentUser();
        TeamResponse team = teamService.getTeamByLeadId(current.getId());
        return ResponseEntity.ok(taskService.getTasksByTeam(team.getId()));
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(taskService.createTask(request, current));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
                                                    @RequestBody UpdateTaskRequest request) {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(taskService.updateTask(id, request, current));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse> deleteTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.deleteTask(id));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping("/tasks/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id,
                                                       @Valid @RequestBody CommentRequest request) {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(taskService.addComment(id, request, current));
    }

    @GetMapping("/tasks/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getComments(id));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        User current = authService.getCurrentUser();
        TeamResponse team = teamService.getTeamByLeadId(current.getId());
        return ResponseEntity.ok(dashboardService.getTeamLeadDashboard(team.getId()));
    }
}
