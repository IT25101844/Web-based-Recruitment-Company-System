package com.jobconnect.dto.message;

import java.time.LocalDateTime;

public class ConversationDto {
    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserEmail;
    private String otherUserRole;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;

    public ConversationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOtherUserId() { return otherUserId; }
    public void setOtherUserId(Long otherUserId) { this.otherUserId = otherUserId; }

    public String getOtherUserName() { return otherUserName; }
    public void setOtherUserName(String otherUserName) { this.otherUserName = otherUserName; }

    public String getOtherUserEmail() { return otherUserEmail; }
    public void setOtherUserEmail(String otherUserEmail) { this.otherUserEmail = otherUserEmail; }

    public String getOtherUserRole() { return otherUserRole; }
    public void setOtherUserRole(String otherUserRole) { this.otherUserRole = otherUserRole; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageTime() { return lastMessageTime; }
    public void setLastMessageTime(LocalDateTime lastMessageTime) { this.lastMessageTime = lastMessageTime; }

    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
}
