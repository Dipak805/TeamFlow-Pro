package com.teammanagement.repository;

import com.teammanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRole(User.Role role);
    List<User> findByTeamId(Long teamId);

    @Query("SELECT u FROM User u WHERE u.team.id = :teamId AND u.role = 'MEMBER'")
    List<User> findMembersByTeamId(Long teamId);
}
