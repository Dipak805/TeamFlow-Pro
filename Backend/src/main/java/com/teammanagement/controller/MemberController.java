package com.teammanagement.controller;

import com.teammanagement.dto.*;
import com.teammanagement.model.User;
import com.teammanagement.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/member")
@PreAuthorize("hasAnyRole('MEMBER','TEAM_LEAD','MANAGER')")
public class MemberController {

    @Autowired private TaskService taskService;
    @Autowired private FileService fileService;
    @Autowired private NotificationService notificationService;
    @Autowired private AuthService authService;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getMyTasks() {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(taskService.getTasksByUser(current.getId()));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PutMapping("/tasks/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id,
                                                          @RequestBody UpdateTaskRequest request) {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(taskService.updateTask(id, request, current));
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

    @PostMapping("/tasks/{id}/files")
    public ResponseEntity<FileResponse> uploadFile(@PathVariable Long id,
                                                    @RequestParam("file") MultipartFile file) {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(fileService.uploadFile(id, file, current));
    }

    @GetMapping("/tasks/{id}/files")
    public ResponseEntity<List<FileResponse>> getTaskFiles(@PathVariable Long id) {
        return ResponseEntity.ok(fileService.getTaskFiles(id));
    }

    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        Resource resource = fileService.loadFile(fileId);
        String fileName = fileService.getOriginalFileName(fileId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(notificationService.getUserNotifications(current.getId()));
    }

    @GetMapping("/notifications/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        User current = authService.getCurrentUser();
        return ResponseEntity.ok(notificationService.getUnreadCount(current.getId()));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<ApiResponse> markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read"));
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<ApiResponse> markAllRead() {
        User current = authService.getCurrentUser();
        notificationService.markAllAsRead(current.getId());
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read"));
    }
}
