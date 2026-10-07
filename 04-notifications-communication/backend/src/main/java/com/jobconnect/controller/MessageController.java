package com.jobconnect.controller;

import com.jobconnect.dto.message.ConversationDto;
import com.jobconnect.dto.message.MessageDto;
import com.jobconnect.dto.message.SendMessageDto;
import com.jobconnect.service.MessagingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessagingService messagingService;

    public MessageController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody SendMessageDto dto) {
        return ResponseEntity.ok(messagingService.sendMessage(dto));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations() {
        return ResponseEntity.ok(messagingService.getMyConversations());
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<List<MessageDto>> getConversationMessages(@PathVariable Long id) {
        return ResponseEntity.ok(messagingService.getConversationMessages(id));
    }

    @PatchMapping("/conversations/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        messagingService.markConversationAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Conversation marked as read"));
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<?> deleteConversation(@PathVariable Long id) {
        messagingService.deleteConversation(id);
        return ResponseEntity.ok(Map.of("message", "Conversation deleted successfully"));
    }
}
