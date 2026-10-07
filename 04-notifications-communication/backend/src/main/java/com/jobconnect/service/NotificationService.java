package com.jobconnect.service;

import com.jobconnect.dto.notification.NotificationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    NotificationDto createNotification(Long recipientId, String type, String title, String message, Long referenceId);
    Page<NotificationDto> getMyNotifications(Pageable pageable);
    List<NotificationDto> getTopNotifications();
    long getUnreadCount();
    void markAsRead(Long notificationId);
    void markAllAsRead();
    void deleteNotification(Long notificationId);
}
