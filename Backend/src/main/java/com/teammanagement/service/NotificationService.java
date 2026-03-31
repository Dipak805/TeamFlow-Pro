package com.teammanagement.service;

import com.teammanagement.dto.NotificationResponse;
import com.teammanagement.model.Notification;
import com.teammanagement.model.Task;
import com.teammanagement.model.User;
import com.teammanagement.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notificationRepository;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void createNotification(User user, Task task, String type, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTask(task);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRead(false);
        notificationRepository.save(notification);

        NotificationResponse response = toResponse(notification);
        messagingTemplate.convertAndSendToUser(
                user.getUsername(), "/queue/notifications", response);
    }

    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationResponse toResponse(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setId(n.getId());
        r.setMessage(n.getMessage());
        r.setType(n.getType());
        r.setRead(n.isRead());
        r.setTaskId(n.getTask() != null ? n.getTask().getId() : null);
        r.setCreatedAt(n.getCreatedAt());
        return r;
    }
}
