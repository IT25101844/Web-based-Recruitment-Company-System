package com.jobconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(length = 150)
    private String headline;

    @Column(length = 150)
    private String location;

    @Column(length = 255)
    private String address;

    @Column(name = "professional_summary", columnDefinition = "NVARCHAR(MAX)")
    private String professionalSummary;

    @Column(name = "profile_picture_path", length = 255)
    private String profilePicturePath;

    @Column(name = "profile_completion_pct", nullable = false)
    private int profileCompletionPct = 20;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateEducation> educationList = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateExperience> experienceList = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateSkill> candidateSkills = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resume> resumes = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public CandidateProfile() {}

    public CandidateProfile(User user) {
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public List<CandidateEducation> getEducationList() { return educationList; }
    public void setEducationList(List<CandidateEducation> educationList) { this.educationList = educationList; }

    public List<CandidateExperience> getExperienceList() { return experienceList; }
    public void setExperienceList(List<CandidateExperience> experienceList) { this.experienceList = experienceList; }

    public List<CandidateSkill> getCandidateSkills() { return candidateSkills; }
    public void setCandidateSkills(List<CandidateSkill> candidateSkills) { this.candidateSkills = candidateSkills; }

    public List<Resume> getResumes() { return resumes; }
    public void setResumes(List<Resume> resumes) { this.resumes = resumes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
