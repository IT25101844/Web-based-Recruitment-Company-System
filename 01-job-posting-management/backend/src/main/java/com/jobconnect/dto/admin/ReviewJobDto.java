package com.jobconnect.dto.admin;

import jakarta.validation.constraints.NotBlank;

public class ReviewJobDto {

    @NotBlank(message = "Action must be APPROVE or REJECT")
    private String action;

    private String rejectionReason;

    public ReviewJobDto() {}

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
