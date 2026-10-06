package com.jobconnect.dto.admin;

import java.util.HashMap;
import java.util.Map;

public class DashboardStatsDto {

    private long totalUsers;
    private long totalCandidates;
    private long totalEmployers;
    private long pendingEmployers;
    private long pendingJobs;
    private long activeJobs;
    private long totalApplications;
    private long openComplaints;
    private long suspendedUsers;
    private Map<String, Long> additionalMetrics = new HashMap<>();

    public DashboardStatsDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalCandidates() { return totalCandidates; }
    public void setTotalCandidates(long totalCandidates) { this.totalCandidates = totalCandidates; }

    public long getTotalEmployers() { return totalEmployers; }
    public void setTotalEmployers(long totalEmployers) { this.totalEmployers = totalEmployers; }

    public long getPendingEmployers() { return pendingEmployers; }
    public void setPendingEmployers(long pendingEmployers) { this.pendingEmployers = pendingEmployers; }

    public long getPendingJobs() { return pendingJobs; }
    public void setPendingJobs(long pendingJobs) { this.pendingJobs = pendingJobs; }

    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getOpenComplaints() { return openComplaints; }
    public void setOpenComplaints(long openComplaints) { this.openComplaints = openComplaints; }

    public long getPendingComplaints() { return openComplaints; }
    public void setPendingComplaints(long pendingComplaints) { this.openComplaints = pendingComplaints; }

    public long getSuspendedUsers() { return suspendedUsers; }
    public void setSuspendedUsers(long suspendedUsers) { this.suspendedUsers = suspendedUsers; }

    public Map<String, Long> getAdditionalMetrics() { return additionalMetrics; }
    public void setAdditionalMetrics(Map<String, Long> additionalMetrics) { this.additionalMetrics = additionalMetrics; }
}
