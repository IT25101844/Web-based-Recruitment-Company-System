package com.jobconnect.service;

import com.jobconnect.dto.job.JobCreateDto;
import com.jobconnect.dto.job.JobResponseDto;
import com.jobconnect.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface JobService {

    JobResponseDto createJob(JobCreateDto dto);
    JobResponseDto updateJob(Long jobId, JobCreateDto dto);
    JobResponseDto getJobById(Long jobId, boolean countView);
    void closeJob(Long jobId);
    void reopenJob(Long jobId);
    void deleteJob(Long jobId);

    Page<JobResponseDto> searchPublicJobs(
            String keyword, String location, String skill, String jobType, String expLevel, BigDecimal minSalary, Pageable pageable);

    Page<JobResponseDto> getEmployerJobs(Long employerId, String status, Pageable pageable);
    Page<JobResponseDto> getMyJobs(String status, Pageable pageable);

    int expireOverdueJobs();
}
