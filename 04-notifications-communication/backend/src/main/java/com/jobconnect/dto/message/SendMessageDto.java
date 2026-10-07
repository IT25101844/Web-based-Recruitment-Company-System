package com.jobconnect.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SendMessageDto {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotBlank(message = "Message cannot be empty")
    private String messageBody;

    public SendMessageDto() {}

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getMessageBody() { return messageBody; }
    public void setMessageBody(String messageBody) { this.messageBody = messageBody; }
}
