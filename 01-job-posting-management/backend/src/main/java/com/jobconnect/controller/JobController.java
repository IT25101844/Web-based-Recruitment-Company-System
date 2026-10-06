package com.jobconnect.controller;

import com.jobconnect.dto.job.JobCreateDto;
import com.jobconnect.dto.job.JobResponseDto;
import com.jobconnect.entity.JobPosting;
import com.jobconnect.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping({"", "/public"})
    public ResponseEntity<Page<JobResponseDto>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String expLevel,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {

        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null && sort.contains(",")) {
            String[] parts = sort.split(",");
            sortOrder = Sort.by(Sort.Direction.fromString(parts.length > 1 ? parts[1] : "desc"), parts[0]);
        }
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        return ResponseEntity.ok(jobService.searchPublicJobs(keyword, location, skill, jobType, expLevel, minSalary, pageable));
    }

    @GetMapping({"/{id:[0-9]+}", "/public/{id:[0-9]+}"})
    public ResponseEntity<JobResponseDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id, true));
    }

    @PostMapping
    public ResponseEntity<JobResponseDto> createJob(@Valid @RequestBody JobCreateDto dto) {
        return ResponseEntity.ok(jobService.createJob(dto));
    }

    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<JobResponseDto> updateJob(@PathVariable Long id, @Valid @RequestBody JobCreateDto dto) {
        return ResponseEntity.ok(jobService.updateJob(id, dto));
    }

    @PatchMapping("/{id:[0-9]+}/close")
    public ResponseEntity<?> closeJob(@PathVariable Long id) {
        jobService.closeJob(id);
        return ResponseEntity.ok(Map.of("message", "Job posting closed successfully"));
    }

    @PatchMapping("/{id:[0-9]+}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            JobPosting.JobStatus jobStatus = JobPosting.JobStatus.valueOf(status.toUpperCase());
            if (jobStatus == JobPosting.JobStatus.CLOSED) {
                jobService.closeJob(id);
            } else if (jobStatus == JobPosting.JobStatus.APPROVED) {
                // Allow employers to reopen approved jobs
                jobService.reopenJob(id);
            }
            return ResponseEntity.ok(Map.of("message", "Job status updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status: " + status));
        }
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(Map.of("message", "Job posting removed successfully"));
    }

    @GetMapping({"/my", "/employer/my-jobs"})
    public ResponseEntity<?> getMyJobs(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<JobResponseDto> result = jobService.getMyJobs(status, pageable);
        return ResponseEntity.ok(result.getContent());
    }
}
