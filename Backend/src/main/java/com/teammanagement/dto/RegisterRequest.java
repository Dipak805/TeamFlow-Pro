package com.teammanagement.dto;
import com.teammanagement.model.User;
import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank @Size(min=3,max=50) private String username;
    @NotBlank @Email private String email;
    @NotBlank @Size(min=6) private String password;
    @NotBlank private String fullName;
    private User.Role role = User.Role.MEMBER;
    private String phone;
    private String department;
    private Long teamId;

    public RegisterRequest() {}
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
}
