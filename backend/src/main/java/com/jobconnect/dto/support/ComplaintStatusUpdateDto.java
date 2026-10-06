package com.jobconnect.dto.support;

public class ComplaintStatusUpdateDto {

    private String status;
    private String priority;
    private Long assignedToId;
    private String resolutionNote;

    public ComplaintStatusUpdateDto() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }

    public String getResolutionNote() { return resolutionNote; }
    public void setResolutionNote(String resolutionNote) { this.resolutionNote = resolutionNote; }

    public String getResolutionNotes() { return resolutionNote; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNote = resolutionNotes; }
}
