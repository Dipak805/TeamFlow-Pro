package com.teammanagement.repository;

import com.teammanagement.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByTeamId(Long teamId);
    List<Task> findByStatus(Task.Status status);
    List<Task> findByPriority(Task.Priority priority);
    List<Task> findByTeamIdAndStatus(Long teamId, Task.Status status);
    List<Task> findByAssignedToIdAndStatus(Long userId, Task.Status status);
    long countByStatus(Task.Status status);
    long countByPriority(Task.Priority priority);

    @Query("SELECT t FROM Task t WHERE t.dueDate <= :date AND t.status != 'DONE'")
    List<Task> findOverdueTasks(@Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :today AND :upcoming AND t.status != 'DONE'")
    List<Task> findUpcomingDeadlines(@Param("today") LocalDate today, @Param("upcoming") LocalDate upcoming);

    @Query("SELECT t FROM Task t WHERE t.team.id = :teamId AND t.priority = 'HIGH'")
    List<Task> findHighPriorityByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status = 'DONE'")
    Long countCompletedTasksByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.team.id = :teamId AND t.status = :status")
    Long countByTeamIdAndStatus(@Param("teamId") Long teamId, @Param("status") Task.Status status);
}
