package com.teammanagement.service;

import com.teammanagement.dto.*;
import com.teammanagement.model.Task;
import com.teammanagement.model.Team;
import com.teammanagement.model.User;
import com.teammanagement.repository.TaskRepository;
import com.teammanagement.repository.TeamRepository;
import com.teammanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired private TeamRepository teamRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TaskRepository taskRepository;

    @Transactional
    public TeamResponse createTeam(CreateTeamRequest request) {
        if (teamRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Team with name '" + request.getName() + "' already exists");
        }
        Team team = new Team();
        team.setName(request.getName());
        team.setDescription(request.getDescription());
        team.setActive(true);

        if (request.getTeamLeadId() != null) {
            User lead = userRepository.findById(request.getTeamLeadId())
                    .orElseThrow(() -> new RuntimeException("Team lead not found"));
            team.setTeamLead(lead);
            team = teamRepository.save(team);
            lead.setTeam(team);
            userRepository.save(lead);
        } else {
            team = teamRepository.save(team);
        }
        return toResponse(team);
    }

    @Transactional
    public TeamResponse updateTeam(Long id, CreateTeamRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        team.setName(request.getName());
        team.setDescription(request.getDescription());

        if (request.getTeamLeadId() != null) {
            User lead = userRepository.findById(request.getTeamLeadId())
                    .orElseThrow(() -> new RuntimeException("Team lead not found"));
            team.setTeamLead(lead);
            lead.setTeam(team);
            userRepository.save(lead);
        }
        return toResponse(teamRepository.save(team));
    }

    @Transactional
    public ApiResponse deleteTeam(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        team.setActive(false);
        teamRepository.save(team);
        return new ApiResponse(true, "Team deleted successfully");
    }

    public List<TeamResponse> getAllTeams() {
        return teamRepository.findByActiveTrue().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public TeamResponse getTeamById(Long id) {
        return toResponse(teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found")));
    }

    @Transactional
    public ApiResponse addMemberToTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTeam(team);
        userRepository.save(user);
        return new ApiResponse(true, "Member added successfully");
    }

    @Transactional
    public ApiResponse removeMemberFromTeam(Long teamId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getTeam() != null && user.getTeam().getId().equals(teamId)) {
            user.setTeam(null);
            userRepository.save(user);
        }
        return new ApiResponse(true, "Member removed successfully");
    }

    public List<UserSummary> getTeamMembers(Long teamId) {
        return userRepository.findByTeamId(teamId).stream()
                .map(this::toUserSummary).collect(Collectors.toList());
    }

    public TeamResponse getTeamByLeadId(Long leadId) {
        Team team = teamRepository.findByTeamLeadId(leadId)
                .orElseThrow(() -> new RuntimeException("No team assigned to this lead"));
        return toResponse(team);
    }

    public TeamResponse toResponse(Team team) {
        long total = taskRepository.countByTeamIdAndStatus(team.getId(), Task.Status.TODO)
                   + taskRepository.countByTeamIdAndStatus(team.getId(), Task.Status.IN_PROGRESS)
                   + taskRepository.countByTeamIdAndStatus(team.getId(), Task.Status.REVIEW)
                   + taskRepository.countByTeamIdAndStatus(team.getId(), Task.Status.DONE);
        long done = taskRepository.countByTeamIdAndStatus(team.getId(), Task.Status.DONE);

        List<UserSummary> members = userRepository.findByTeamId(team.getId()).stream()
                .map(this::toUserSummary).collect(Collectors.toList());

        TeamResponse r = new TeamResponse();
        r.setId(team.getId());
        r.setName(team.getName());
        r.setDescription(team.getDescription());
        r.setTeamLead(team.getTeamLead() != null ? toUserSummary(team.getTeamLead()) : null);
        r.setMembers(members);
        r.setTotalTasks((int) total);
        r.setCompletedTasks((int) done);
        r.setCreatedAt(team.getCreatedAt());
        return r;
    }

    public UserSummary toUserSummary(User u) {
        UserSummary s = new UserSummary();
        s.setId(u.getId());
        s.setUsername(u.getUsername());
        s.setFullName(u.getFullName());
        s.setEmail(u.getEmail());
        s.setRole(u.getRole().name());
        s.setDepartment(u.getDepartment());
        s.setPhone(u.getPhone());
        s.setActive(u.isActive());
        return s;
    }
}
