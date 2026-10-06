package com.jobconnect.dto.candidate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CandidateSummaryDto {

    private Long id;
    private Long userId;
    private String fullName;
    private String headline;
    private String location;
    private String professionalSummary;
    private String profilePicturePath;
    private int profileCompletionPct;
    private String latestExperience;
    private String latestEducation;
    private List<String> topSkills = new ArrayList<>();
    private long likesCount;
    private boolean likedByCurrentUser;
    private LocalDateTime likedAt;

    public CandidateSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getProfessionalSummary() { return professionalSummary; }
    public void setProfessionalSummary(String professionalSummary) { this.professionalSummary = professionalSummary; }

    public String getProfilePicturePath() { return profilePicturePath; }
    public void setProfilePicturePath(String profilePicturePath) { this.profilePicturePath = profilePicturePath; }

    public int getProfileCompletionPct() { return profileCompletionPct; }
    public void setProfileCompletionPct(int profileCompletionPct) { this.profileCompletionPct = profileCompletionPct; }

    public String getLatestExperience() { return latestExperience; }
    public void setLatestExperience(String latestExperience) { this.latestExperience = latestExperience; }

    public String getLatestEducation() { return latestEducation; }
    public void setLatestEducation(String latestEducation) { this.latestEducation = latestEducation; }

    public List<String> getTopSkills() { return topSkills; }
    public void setTopSkills(List<String> topSkills) { this.topSkills = topSkills; }

    public long getLikesCount() { return likesCount; }
    public void setLikesCount(long likesCount) { this.likesCount = likesCount; }

    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }

    public LocalDateTime getLikedAt() { return likedAt; }
    public void setLikedAt(LocalDateTime likedAt) { this.likedAt = likedAt; }
}
