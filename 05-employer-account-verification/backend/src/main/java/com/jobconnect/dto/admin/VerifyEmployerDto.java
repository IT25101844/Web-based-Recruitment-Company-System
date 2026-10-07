package com.jobconnect.dto.admin;

public class VerifyEmployerDto {

    private String action;
    private String status;
    private String rejectionReason;
    private String notes;

    public VerifyEmployerDto() {}

    public String getAction() {
        if (action != null && !action.isBlank()) {
            return action;
        }
        if ("VERIFIED".equalsIgnoreCase(status) || "APPROVED".equalsIgnoreCase(status) || "APPROVE".equalsIgnoreCase(status)) {
            return "APPROVE";
        }
        if ("REJECTED".equalsIgnoreCase(status) || "REJECT".equalsIgnoreCase(status)) {
            return "REJECT";
        }
        return action;
    }

    public void setAction(String action) { 
        this.action = action; 
    }

    public String getStatus() { 
        return status; 
    }

    public void setStatus(String status) { 
        this.status = status; 
        if (this.action == null) {
            if ("VERIFIED".equalsIgnoreCase(status) || "APPROVED".equalsIgnoreCase(status)) {
                this.action = "APPROVE";
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                this.action = "REJECT";
            }
        }
    }

    public String getRejectionReason() { 
        return rejectionReason != null ? rejectionReason : notes; 
    }

    public void setRejectionReason(String rejectionReason) { 
        this.rejectionReason = rejectionReason; 
    }

    public String getNotes() { 
        return notes != null ? notes : rejectionReason; 
    }

    public void setNotes(String notes) { 
        this.notes = notes;
        if (this.rejectionReason == null) {
            this.rejectionReason = notes;
        }
    }
}
