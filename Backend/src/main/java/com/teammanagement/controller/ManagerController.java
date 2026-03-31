package com.teammanagement.controller;

import com.teammanagement.dto.*;
import com.teammanagement.model.User;
import com.teammanagement.repository.UserRepository;
import com.teammanagement.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    @Autowired private TeamService teamService;
    @Autowired private TaskService taskService;
    @Autowired private DashboardService dashboardService;
    @Autowired private AuthService authService;
    @Autowired private UserRepository userRepository;

    // ---- Teams ----
    @GetMapping("/teams")
    public ResponseEntity<List<TeamResponse>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @PostMapping("/teams")
    public ResponseEntity<TeamResponse> createTeam(@Valid @RequestBody CreateTeamRequest request) {
        return ResponseEntity.ok(teamService.createTeam(request));
    }

    @PutMapping("/teams/{id}")
    public ResponseEntity<TeamResponse> updateTeam(@PathVariable Long id,
                                                    @Valid @RequestBody CreateTeamRequest request) {
        return ResponseEntity.ok(teamService.updateTeam(id, request));
    }

    @DeleteMapping("/teams/{id}")
    public ResponseEntity<ApiResponse> deleteTeam(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.deleteTeam(id));
    }

    @PostMapping("/teams/{teamId}/members/{userId}")
    public ResponseEntity<ApiResponse> addMember(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.addMemberToTeam(teamId, userId));
    }

    @DeleteMapping("/teams/{teamId}/members/{userId}")
    public ResponseEntity<ApiResponse> removeMember(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.removeMemberFromTeam(teamId, userId));
    }

    // ---- Users ----
    @GetMapping("/users")
    public ResponseEntity<List<UserSummary>> getAllUsers() {
        List<UserSummary> users = userRepository.findAll().stream()
                .map(teamService::toUserSummary).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse> createUser(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "User status updated"));
    }

    // ---- Tasks ----
    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // ---- Dashboard ----
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        return ResponseEntity.ok(dashboardService.getManagerDashboard());
    }
}
