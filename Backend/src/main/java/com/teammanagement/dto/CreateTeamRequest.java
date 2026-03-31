package com.teammanagement.dto;
import jakarta.validation.constraints.NotBlank;

public class CreateTeamRequest {
    @NotBlank private String name;
    private String description;
    private Long teamLeadId;

    public CreateTeamRequest() {}
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getTeamLeadId() { return teamLeadId; }
    public void setTeamLeadId(Long teamLeadId) { this.teamLeadId = teamLeadId; }
}
