package com.jobconnect.service.impl;

import com.jobconnect.dto.message.ConversationDto;
import com.jobconnect.dto.message.MessageDto;
import com.jobconnect.dto.message.SendMessageDto;
import com.jobconnect.entity.Conversation;
import com.jobconnect.entity.Message;
import com.jobconnect.entity.Role;
import com.jobconnect.entity.User;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.ConversationRepository;
import com.jobconnect.repository.MessageRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.security.UserPrincipal;
import com.jobconnect.service.MessagingService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessagingServiceImpl implements MessagingService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessagingServiceImpl(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
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
    public MessageDto sendMessage(SendMessageDto dto) {
        UserPrincipal user = getCurrentUser();
        User sender = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user.getId()));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getReceiverId()));

        Conversation conversation = conversationRepository.findBetweenUsers(sender.getId(), receiver.getId())
                .orElseGet(() -> conversationRepository.save(new Conversation(sender, receiver)));

        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        Message message = new Message(conversation, sender, receiver, dto.getMessageBody());
        Message saved = messageRepository.save(message);

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationDto> getMyConversations() {
        UserPrincipal user = getCurrentUser();
        List<Conversation> conversations = conversationRepository.findUserConversations(user.getId());

        List<ConversationDto> dtos = new ArrayList<>();
        for (Conversation c : conversations) {
            User otherUser = c.getParticipantOne().getId().equals(user.getId()) ?
                    c.getParticipantTwo() : c.getParticipantOne();

            ConversationDto dto = new ConversationDto();
            dto.setId(c.getId());
            dto.setOtherUserId(otherUser.getId());
            dto.setOtherUserName(otherUser.getFullName());
            dto.setOtherUserEmail(otherUser.getEmail());
            dto.setOtherUserRole(otherUser.getRoles().stream().findFirst().map(Role::getName).orElse("USER"));

            List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId());
            if (!messages.isEmpty()) {
                Message last = messages.get(messages.size() - 1);
                dto.setLastMessage(last.getMessageBody());
                dto.setLastMessageTime(last.getCreatedAt());
            }

            long unread = messages.stream()
                    .filter(m -> m.getReceiver().getId().equals(user.getId()) && !m.isRead())
                    .count();
            dto.setUnreadCount(unread);

            dtos.add(dto);
        }

        return dtos;
    }

    @Override
    public List<MessageDto> getConversationMessages(Long conversationId) {
        UserPrincipal user = getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", conversationId));

        if (!conversation.getParticipantOne().getId().equals(user.getId()) &&
                !conversation.getParticipantTwo().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to view this conversation");
        }

        // Mark messages as read
        messageRepository.markConversationMessagesAsRead(conversationId, user.getId());

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void markConversationAsRead(Long conversationId) {
        UserPrincipal user = getCurrentUser();
        messageRepository.markConversationMessagesAsRead(conversationId, user.getId());
    }

    @Override
    public void deleteConversation(Long conversationId) {
        UserPrincipal user = getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", conversationId));

        if (!conversation.getParticipantOne().getId().equals(user.getId()) &&
                !conversation.getParticipantTwo().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this conversation");
        }

        // Delete all messages first, then the conversation
        messageRepository.deleteByConversationId(conversationId);
        conversationRepository.delete(conversation);
    }

    private MessageDto mapToDto(Message m) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setConversationId(m.getConversation().getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getFullName());
        dto.setReceiverId(m.getReceiver().getId());
        dto.setReceiverName(m.getReceiver().getFullName());
        dto.setMessageBody(m.getMessageBody());
        dto.setRead(m.isRead());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }
}
