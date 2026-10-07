package com.jobconnect.service;

import com.jobconnect.dto.message.ConversationDto;
import com.jobconnect.dto.message.MessageDto;
import com.jobconnect.dto.message.SendMessageDto;

import java.util.List;

public interface MessagingService {
    MessageDto sendMessage(SendMessageDto dto);
    List<ConversationDto> getMyConversations();
    List<MessageDto> getConversationMessages(Long conversationId);
    void markConversationAsRead(Long conversationId);
    void deleteConversation(Long conversationId);
}
