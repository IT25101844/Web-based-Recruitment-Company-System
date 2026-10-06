package com.jobconnect.service.impl;

import com.jobconnect.dto.job.JobCreateDto;
import com.jobconnect.dto.job.JobResponseDto;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.*;
import com.jobconnect.security.UserPrincipal;
import com.jobconnect.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobServiceImpl implements JobService {

    private final JobPostingRepository jobPostingRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final SkillRepository skillRepository;
    private final ApplicationRepository applicationRepository;

    public JobServiceImpl(
            JobPostingRepository jobPostingRepository,
            EmployerProfileRepository employerProfileRepository,
            SkillRepository skillRepository,
            ApplicationRepository applicationRepository) {
        this.jobPostingRepository = jobPostingRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.skillRepository = skillRepository;
        this.applicationRepository = applicationRepository;
    }

    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return (UserPrincipal) auth.getPrincipal();
    }

    private EmployerProfile getCurrentEmployerProfile() {
        UserPrincipal user = getCurrentUser();
        return employerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer Profile", "userId", user.getId()));
    }

    @Override
    public JobResponseDto createJob(JobCreateDto dto) {
        EmployerProfile employer = getCurrentEmployerProfile();

        // Enforce rule: Unverified employer cannot publish jobs
        if (employer.getVerificationStatus() != EmployerProfile.VerificationStatus.VERIFIED) {
            throw new UnauthorizedException("Your employer account is pending verification. Only verified employers can publish jobs.");
        }

        if (dto.getDeadline().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Application deadline must be in the future");
        }

        JobPosting job = new JobPosting();
        job.setEmployer(employer);
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements());
        job.setLocation(dto.getLocation());

        if (dto.getJobType() != null) {
            try { job.setJobType(JobPosting.JobType.valueOf(dto.getJobType().toUpperCase())); } catch (Exception ignored) {}
        }
        if (dto.getExperienceLevel() != null) {
            try { job.setExperienceLevel(JobPosting.ExperienceLevel.valueOf(dto.getExperienceLevel().toUpperCase())); } catch (Exception ignored) {}
        }

        job.setSalaryMin(dto.getSalaryMin());
        job.setSalaryMax(dto.getSalaryMax());
        job.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "LKR");
        job.setDeadline(dto.getDeadline());
        job.setStatus(JobPosting.JobStatus.PENDING_REVIEW);

        // Required skills
        Set<Skill> skills = new HashSet<>();
        if (dto.getRequiredSkillNames() != null) {
            for (String skillName : dto.getRequiredSkillNames()) {
                if (StringUtils.hasText(skillName)) {
                    Skill s = skillRepository.findByNameIgnoreCase(skillName.trim())
                            .orElseGet(() -> skillRepository.save(new Skill(skillName.trim(), "General")));
                    skills.add(s);
                }
            }
        }
        job.setRequiredSkills(skills);

        JobPosting saved = jobPostingRepository.save(job);
        return mapToResponseDto(saved);
    }

    @Override
    public JobResponseDto updateJob(Long jobId, JobCreateDto dto) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", jobId));

        UserPrincipal user = getCurrentUser();
        boolean isAdmin = user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !job.getEmployer().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this job posting");
        }

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements());
        job.setLocation(dto.getLocation());
        if (dto.getJobType() != null) {
            try { job.setJobType(JobPosting.JobType.valueOf(dto.getJobType().toUpperCase())); } catch (Exception ignored) {}
        }
        if (dto.getExperienceLevel() != null) {
            try { job.setExperienceLevel(JobPosting.ExperienceLevel.valueOf(dto.getExperienceLevel().toUpperCase())); } catch (Exception ignored) {}
        }
        job.setSalaryMin(dto.getSalaryMin());
        job.setSalaryMax(dto.getSalaryMax());
        job.setDeadline(dto.getDeadline());

        if (dto.getRequiredSkillNames() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : dto.getRequiredSkillNames()) {
                if (StringUtils.hasText(skillName)) {
                    Skill s = skillRepository.findByNameIgnoreCase(skillName.trim())
                            .orElseGet(() -> skillRepository.save(new Skill(skillName.trim(), "General")));
                    skills.add(s);
                }
            }
            job.setRequiredSkills(skills);
        }

        JobPosting updated = jobPostingRepository.save(job);
        return mapToResponseDto(updated);
    }

    @Override
    public JobResponseDto getJobById(Long jobId, boolean countView) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", jobId));

        // Check if overdue & auto-expire
        if (job.getStatus() == JobPosting.JobStatus.APPROVED && job.getDeadline().isBefore(LocalDateTime.now())) {
            job.setStatus(JobPosting.JobStatus.EXPIRED);
            jobPostingRepository.save(job);
        }

        if (countView) {
            job.setViewsCount(job.getViewsCount() + 1);
            jobPostingRepository.save(job);
        }

        return mapToResponseDto(job);
    }

    @Override
    public void closeJob(Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", jobId));

        UserPrincipal user = getCurrentUser();
        boolean isAdmin = user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !job.getEmployer().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to close this job");
        }

        job.setStatus(JobPosting.JobStatus.CLOSED);
        jobPostingRepository.save(job);
    }

    @Override
    public void reopenJob(Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", jobId));

        UserPrincipal user = getCurrentUser();
        boolean isAdmin = user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !job.getEmployer().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to reopen this job");
        }

        job.setStatus(JobPosting.JobStatus.APPROVED);
        jobPostingRepository.save(job);
    }

    @Override
    public void deleteJob(Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", jobId));

        UserPrincipal user = getCurrentUser();
        boolean isAdmin = user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !job.getEmployer().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this job");
        }

        jobPostingRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> searchPublicJobs(
            String keyword, String location, String skill, String jobType, String expLevel, BigDecimal minSalary, Pageable pageable) {

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;
        String loc = StringUtils.hasText(location) ? location.trim() : null;
        String sk = StringUtils.hasText(skill) ? skill.trim() : null;

        JobPosting.JobType jt = null;
        if (StringUtils.hasText(jobType)) {
            try { jt = JobPosting.JobType.valueOf(jobType.toUpperCase()); } catch (Exception ignored) {}
        }

        JobPosting.ExperienceLevel el = null;
        if (StringUtils.hasText(expLevel)) {
            try { el = JobPosting.ExperienceLevel.valueOf(expLevel.toUpperCase()); } catch (Exception ignored) {}
        }

        // Search APPROVED jobs only (jobs need admin approval to appear publicly)
        Page<JobPosting> page = jobPostingRepository.searchJobs(
                JobPosting.JobStatus.APPROVED, kw, loc, sk, jt, el, minSalary, pageable);

        return page.map(this::mapToResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> getEmployerJobs(Long employerId, String status, Pageable pageable) {
        if (StringUtils.hasText(status)) {
            try {
                JobPosting.JobStatus js = JobPosting.JobStatus.valueOf(status.toUpperCase());
                return jobPostingRepository.findByEmployerIdAndStatus(employerId, js, pageable).map(this::mapToResponseDto);
            } catch (Exception ignored) {}
        }
        return jobPostingRepository.findByEmployerId(employerId, pageable).map(this::mapToResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> getMyJobs(String status, Pageable pageable) {
        EmployerProfile employer = getCurrentEmployerProfile();
        return getEmployerJobs(employer.getId(), status, pageable);
    }

    @Override
    public int expireOverdueJobs() {
        return jobPostingRepository.expireJobsPastDeadline(LocalDateTime.now());
    }

    private JobResponseDto mapToResponseDto(JobPosting job) {
        JobResponseDto dto = new JobResponseDto();
        dto.setId(job.getId());
        dto.setEmployerId(job.getEmployer().getId());
        dto.setCompanyName(job.getEmployer().getCompanyName());
        dto.setCompanyLogoPath(job.getEmployer().getLogoPath());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRequirements(job.getRequirements());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType().name());
        dto.setExperienceLevel(job.getExperienceLevel().name());
        dto.setSalaryMin(job.getSalaryMin());
        dto.setSalaryMax(job.getSalaryMax());
        dto.setCurrency(job.getCurrency());
        dto.setDeadline(job.getDeadline());
        dto.setStatus(job.getStatus().name());
        dto.setRejectionReason(job.getRejectionReason());
        dto.setViewsCount(job.getViewsCount());
        dto.setApplicationsCount(applicationRepository.findByJobId(job.getId(), Pageable.unpaged()).getTotalElements());
        dto.setRequiredSkills(job.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        dto.setCreatedAt(job.getCreatedAt());
        dto.setExpired(job.getDeadline().isBefore(LocalDateTime.now()));
        return dto;
    }
}
