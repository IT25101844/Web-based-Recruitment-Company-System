package com.jobconnect.dto.support;

import jakarta.validation.constraints.NotBlank;

public class ComplaintCreateDto {

    private String issueType = "COMPLAINT";

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    private String priority = "MEDIUM";

    public ComplaintCreateDto() {}

    public String getIssueType() { return issueType; }
    public void setIssueType(String issueType) { this.issueType = issueType; }

    public String getCategory() { return issueType; }
    public void setCategory(String category) { this.issueType = category; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
