package com.jobconnect.controller;

import com.jobconnect.dto.candidate.CandidateProfileDto;
import com.jobconnect.dto.candidate.CandidateSummaryDto;
import com.jobconnect.dto.like.LikeResponseDto;
import com.jobconnect.entity.EmployerProfile;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.security.UserPrincipal;
import com.jobconnect.service.EmployerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/employers")
public class EmployerController {

    private final EmployerService employerService;

    public EmployerController(EmployerService employerService) {
        this.employerService = employerService;
    }

    @GetMapping("/profile")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getCurrentEmployerProfile(@AuthenticationPrincipal UserPrincipal user) {
        try {
            EmployerProfile profile = employerService.getEmployerProfileByUserId(user.getId());
            return ResponseEntity.ok(profile);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("message", "Employer profile not found. Please complete your company profile."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error loading employer profile: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployerProfile> getEmployerProfile(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.getEmployerProfile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployerProfile> updateEmployerProfile(
            @PathVariable Long id, @RequestBody EmployerProfile updatedData) {
        return ResponseEntity.ok(employerService.updateEmployerProfile(id, updatedData));
    }

    @PostMapping(value = "/{id}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadLogo(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String path = employerService.uploadCompanyLogo(id, file);
        return ResponseEntity.ok(Map.of("message", "Company logo uploaded", "logoPath", path));
    }

    @PostMapping(value = "/{id}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(
            @PathVariable Long id,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {
        employerService.uploadVerificationDocument(id, documentType, file);
        return ResponseEntity.ok(Map.of("message", "Verification document uploaded successfully"));
    }

    // Backend candidate search and filter with pagination
    @GetMapping("/candidates")
    public ResponseEntity<Page<CandidateSummaryDto>> searchCandidates(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String education,
            @RequestParam(required = false) String experience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Sort sortOrder = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "desc"), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        return ResponseEntity.ok(employerService.searchCandidates(keyword, location, skill, education, experience, pageable));
    }

    @GetMapping("/candidates/{id}")
    public ResponseEntity<CandidateProfileDto> getCandidateDetails(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.getCandidateDetailsForEmployer(id));
    }

    // Employer Candidate Like Feature
    @PostMapping("/candidates/{id}/like")
    public ResponseEntity<LikeResponseDto> toggleLikeCandidate(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.toggleLikeCandidate(id));
    }

    @GetMapping("/candidates/liked")
    public ResponseEntity<Page<CandidateSummaryDto>> getLikedCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(employerService.getLikedCandidates(pageable));
    }
}
