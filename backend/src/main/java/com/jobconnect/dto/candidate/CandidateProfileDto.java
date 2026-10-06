package com.jobconnect.dto.candidate;

import java.util.ArrayList;
import java.util.List;

public class CandidateProfileDto {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String headline;
    private String location;
    private String address;
    private String professionalSummary;
    private String profilePicturePath;
    private int profileCompletionPct;
    private long likesCount;
    private boolean likedByCurrentUser;

    private List<EducationDto> educationList = new ArrayList<>();
    private List<ExperienceDto> experienceList = new ArrayList<>();
    private List<SkillDto> skills = new ArrayList<>();
    private List<ResumeDto> resumes = new ArrayList<>();

    public CandidateProfileDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProfessionalSummary() { return professionalSummary; }
    public void setProfessionalSummary(String professionalSummary) { this.professionalSummary = professionalSummary; }

    public String getProfilePicturePath() { return profilePicturePath; }
    public void setProfilePicturePath(String profilePicturePath) { this.profilePicturePath = profilePicturePath; }

    public int getProfileCompletionPct() { return profileCompletionPct; }
    public void setProfileCompletionPct(int profileCompletionPct) { this.profileCompletionPct = profileCompletionPct; }

    public int getProfileCompletionPercentage() { return profileCompletionPct; }
    public void setProfileCompletionPercentage(int profileCompletionPercentage) { this.profileCompletionPct = profileCompletionPercentage; }

    public long getLikesCount() { return likesCount; }
    public void setLikesCount(long likesCount) { this.likesCount = likesCount; }

    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }

    public List<EducationDto> getEducationList() { return educationList; }
    public void setEducationList(List<EducationDto> educationList) { this.educationList = educationList; }

    public List<ExperienceDto> getExperienceList() { return experienceList; }
    public void setExperienceList(List<ExperienceDto> experienceList) { this.experienceList = experienceList; }

    public List<SkillDto> getSkills() { return skills; }
    public void setSkills(List<SkillDto> skills) { this.skills = skills; }

    public List<ResumeDto> getResumes() { return resumes; }
    public void setResumes(List<ResumeDto> resumes) { this.resumes = resumes; }
}
