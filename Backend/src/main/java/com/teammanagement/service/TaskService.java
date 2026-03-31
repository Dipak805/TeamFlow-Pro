package com.teammanagement.service;

import com.teammanagement.dto.*;
import com.teammanagement.model.*;
import com.teammanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private TeamRepository teamRepository;
    @Autowired private NotificationService notificationService;

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request, User creator) {
        User assignee = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));

        Team team = creator.getTeam() != null ? creator.getTeam()
                : (assignee.getTeam() != null ? assignee.getTeam() : null);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setAssignedTo(assignee);
        task.setCreatedBy(creator);
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setStatus(Task.Status.TODO);
        task.setTeam(team);

        task = taskRepository.save(task);

        notificationService.createNotification(assignee, task, "TASK_ASSIGNED",
                "New task assigned to you: " + task.getTitle());

        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request, User updater) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Task.Status oldStatus = task.getStatus();

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getAssignedToId() != null) {
            User newAssignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignedTo(newAssignee);
        }

        task = taskRepository.save(task);

        if (request.getStatus() != null && request.getStatus() != oldStatus) {
            if (request.getStatus() == Task.Status.REVIEW && task.getCreatedBy() != null) {
                notificationService.createNotification(task.getCreatedBy(), task,
                        "TASK_COMPLETED", "Task moved to review: " + task.getTitle());
            }
            if (request.getStatus() == Task.Status.DONE && task.getAssignedTo() != null) {
                notificationService.createNotification(task.getAssignedTo(), task,
                        "TASK_REVIEWED", "Task approved and marked done: " + task.getTitle());
            }
        }

        return toResponse(task);
    }

    public TaskResponse getTaskById(Long id) {
        return toResponse(taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found")));
    }

    public List<TaskResponse> getTasksByUser(Long userId) {
        return taskRepository.findByAssignedToId(userId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByTeam(Long teamId) {
        return taskRepository.findByTeamId(teamId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ApiResponse deleteTask(Long id) {
        taskRepository.deleteById(id);
        return new ApiResponse(true, "Task deleted successfully");
    }

    @Transactional
    public CommentResponse addComment(Long taskId, CommentRequest request, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setTask(task);
        comment = commentRepository.save(comment);

        if (!task.getAssignedTo().getId().equals(user.getId())) {
            notificationService.createNotification(task.getAssignedTo(), task,
                    "TASK_UPDATED", user.getFullName() + " commented on: " + task.getTitle());
        }
        if (task.getCreatedBy() != null && !task.getCreatedBy().getId().equals(user.getId())) {
            notificationService.createNotification(task.getCreatedBy(), task,
                    "TASK_UPDATED", user.getFullName() + " commented on: " + task.getTitle());
        }

        return toCommentResponse(comment);
    }

    public List<CommentResponse> getComments(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId).stream()
                .map(this::toCommentResponse).collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional
    public void checkDeadlines() {
        LocalDate threeDays = LocalDate.now().plusDays(3);
        List<Task> upcoming = taskRepository.findUpcomingDeadlines(LocalDate.now(), threeDays);
        upcoming.forEach(task -> {
            if (task.getAssignedTo() != null) {
                notificationService.createNotification(task.getAssignedTo(), task,
                        "DEADLINE_NEAR", "Deadline approaching for: " + task.getTitle()
                                + " (Due: " + task.getDueDate() + ")");
            }
        });
    }

    public TaskResponse toResponse(Task task) {
        boolean overdue = task.getDueDate() != null
                && task.getDueDate().isBefore(LocalDate.now())
                && task.getStatus() != Task.Status.DONE;

        TaskResponse r = new TaskResponse();
        r.setId(task.getId());
        r.setTitle(task.getTitle());
        r.setDescription(task.getDescription());
        r.setStatus(task.getStatus());
        r.setPriority(task.getPriority());
        r.setDueDate(task.getDueDate());
        r.setAssignedTo(task.getAssignedTo() != null ? toUserSummary(task.getAssignedTo()) : null);
        r.setCreatedBy(task.getCreatedBy() != null ? toUserSummary(task.getCreatedBy()) : null);
        r.setTeamId(task.getTeam() != null ? task.getTeam().getId() : null);
        r.setTeamName(task.getTeam() != null ? task.getTeam().getName() : null);
        r.setCreatedAt(task.getCreatedAt());
        r.setUpdatedAt(task.getUpdatedAt());
        r.setOverdue(overdue);
        return r;
    }

    private CommentResponse toCommentResponse(Comment c) {
        CommentResponse r = new CommentResponse();
        r.setId(c.getId());
        r.setContent(c.getContent());
        r.setUser(toUserSummary(c.getUser()));
        r.setCreatedAt(c.getCreatedAt());
        return r;
    }

    private UserSummary toUserSummary(User u) {
        UserSummary s = new UserSummary();
        s.setId(u.getId());
        s.setUsername(u.getUsername());
        s.setFullName(u.getFullName());
        s.setEmail(u.getEmail());
        s.setRole(u.getRole().name());
        s.setDepartment(u.getDepartment());
        return s;
    }
}
