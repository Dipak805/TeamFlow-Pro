package com.teammanagement.repository;

import com.teammanagement.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByActiveTrue();
    Optional<Team> findByName(String name);
    Optional<Team> findByTeamLeadId(Long teamLeadId);
    long countByActiveTrue();
}
