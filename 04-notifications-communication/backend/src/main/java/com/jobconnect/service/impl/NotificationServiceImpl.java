package com.jobconnect.service.impl;

import com.jobconnect.dto.notification.NotificationDto;
import com.jobconnect.entity.Notification;
import com.jobconnect.entity.User;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.NotificationRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.security.UserPrincipal;
import com.jobconnect.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return (UserPrincipal) auth.getPrincipal();
    }

    @Override
    public NotificationDto createNotification(Long recipientId, String type, String title, String message, Long referenceId) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recipientId));

        Notification notification = new Notification(recipient, type, title, message, referenceId);
        Notification saved = notificationRepository.save(notification);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDto> getMyNotifications(Pageable pageable) {
        UserPrincipal user = getCurrentUser();
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId(), pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getTopNotifications() {
        UserPrincipal user = getCurrentUser();
        return notificationRepository.findTop10ByRecipientIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        UserPrincipal user = getCurrentUser();
        return notificationRepository.countByRecipientIdAndReadFalse(user.getId());
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        UserPrincipal user = getCurrentUser();
        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to modify this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead() {
        UserPrincipal user = getCurrentUser();
        notificationRepository.markAllAsRead(user.getId());
    }

    @Override
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        UserPrincipal user = getCurrentUser();
        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    private NotificationDto mapToDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setRecipientId(n.getRecipient().getId());
        dto.setType(n.getType());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setReferenceId(n.getReferenceId());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
