package com.teammanagement.service;

import com.teammanagement.dto.*;
import com.teammanagement.model.Team;
import com.teammanagement.model.User;
import com.teammanagement.repository.TeamRepository;
import com.teammanagement.repository.UserRepository;
import com.teammanagement.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private TeamRepository teamRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(
                request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long teamId = user.getTeam() != null ? user.getTeam().getId() : null;

        JwtResponse response = new JwtResponse();
        response.setToken(jwt);
        response.setType("Bearer");
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().name());
        response.setTeamId(teamId);
        return response;
    }

    @Transactional
    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.MEMBER);
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setActive(true);

        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));
            user.setTeam(team);
        }

        userRepository.save(user);
        return new ApiResponse(true, "User registered successfully!");
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }
}
