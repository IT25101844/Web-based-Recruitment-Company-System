package com.jobconnect.controller;

import com.jobconnect.dto.candidate.*;
import com.jobconnect.entity.CandidateProfile;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.CandidateProfileRepository;
import com.jobconnect.security.UserPrincipal;
import com.jobconnect.service.CandidateService;
import com.jobconnect.service.PdfCvGeneratorService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import com.jobconnect.entity.CandidateLike;
import com.jobconnect.entity.EmployerProfile;
import com.jobconnect.repository.CandidateLikeRepository;
import org.springframework.data.domain.PageRequest;
import java.util.HashMap;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;
    private final PdfCvGeneratorService pdfCvGeneratorService;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateLikeRepository candidateLikeRepository;

    public CandidateController(
            CandidateService candidateService,
            PdfCvGeneratorService pdfCvGeneratorService,
            CandidateProfileRepository candidateProfileRepository,
            CandidateLikeRepository candidateLikeRepository) {
        this.candidateService = candidateService;
        this.pdfCvGeneratorService = pdfCvGeneratorService;
        this.candidateProfileRepository = candidateProfileRepository;
        this.candidateLikeRepository = candidateLikeRepository;
    }

    @GetMapping({"/profile", "/profile/me"})
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<CandidateProfileDto> getCurrentProfile() {
        return ResponseEntity.ok(candidateService.getCurrentCandidateProfile());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @GetMapping("/my-likes")
    public ResponseEntity<List<Map<String, Object>>> getMyLikes() {
        CandidateProfileDto profile = candidateService.getCurrentCandidateProfile();
        List<CandidateLike> likes = candidateLikeRepository.findByCandidateIdWithEmployer(profile.getId());
        List<Map<String, Object>> result = likes.stream().map(l -> {
            EmployerProfile emp = l.getEmployer();
            Map<String, Object> map = new HashMap<>();
            map.put("id", l.getId());
            map.put("employerId", emp.getId());
            map.put("companyName", emp.getCompanyName());
            map.put("industry", emp.getIndustry());
            map.put("city", emp.getAddress());
            map.put("companyDescription", emp.getDescription());
            map.put("likedAt", l.getCreatedAt());
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateProfileDto> getProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getCandidateProfile(id));
    }

    @PutMapping("/{id}/personal-info")
    public ResponseEntity<CandidateProfileDto> updatePersonalInfo(
            @PathVariable Long id, @RequestBody CandidateProfileDto dto) {
        return ResponseEntity.ok(candidateService.updatePersonalInfo(id, dto));
    }

    // Education
    @PostMapping("/{id}/education")
    public ResponseEntity<EducationDto> addEducation(
            @PathVariable Long id, @Valid @RequestBody EducationDto dto) {
        return ResponseEntity.ok(candidateService.addEducation(id, dto));
    }

    @PutMapping("/{id}/education/{eduId}")
    public ResponseEntity<EducationDto> updateEducation(
            @PathVariable Long id, @PathVariable Long eduId, @Valid @RequestBody EducationDto dto) {
        return ResponseEntity.ok(candidateService.updateEducation(id, eduId, dto));
    }

    @DeleteMapping("/{id}/education/{eduId}")
    public ResponseEntity<?> deleteEducation(@PathVariable Long id, @PathVariable Long eduId) {
        candidateService.deleteEducation(id, eduId);
        return ResponseEntity.ok(Map.of("message", "Education record removed successfully"));
    }

    @GetMapping("/{id}/education")
    public ResponseEntity<List<EducationDto>> getEducationList(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getEducationList(id));
    }

    // Experience
    @PostMapping("/{id}/experience")
    public ResponseEntity<ExperienceDto> addExperience(
            @PathVariable Long id, @Valid @RequestBody ExperienceDto dto) {
        return ResponseEntity.ok(candidateService.addExperience(id, dto));
    }

    @PutMapping("/{id}/experience/{expId}")
    public ResponseEntity<ExperienceDto> updateExperience(
            @PathVariable Long id, @PathVariable Long expId, @Valid @RequestBody ExperienceDto dto) {
        return ResponseEntity.ok(candidateService.updateExperience(id, expId, dto));
    }

    @DeleteMapping("/{id}/experience/{expId}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id, @PathVariable Long expId) {
        candidateService.deleteExperience(id, expId);
        return ResponseEntity.ok(Map.of("message", "Experience record removed successfully"));
    }

    @GetMapping("/{id}/experience")
    public ResponseEntity<List<ExperienceDto>> getExperienceList(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getExperienceList(id));
    }

    // Skills
    @PostMapping("/{id}/skills")
    public ResponseEntity<SkillDto> addSkill(@PathVariable Long id, @Valid @RequestBody SkillDto dto) {
        return ResponseEntity.ok(candidateService.addSkill(id, dto));
    }

    @DeleteMapping("/{id}/skills/{skillId}")
    public ResponseEntity<?> removeSkill(@PathVariable Long id, @PathVariable Long skillId) {
        candidateService.removeSkill(id, skillId);
        return ResponseEntity.ok(Map.of("message", "Skill removed successfully"));
    }

    @GetMapping("/{id}/skills")
    public ResponseEntity<List<SkillDto>> getCandidateSkills(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getCandidateSkills(id));
    }

    // Resumes
    @PostMapping(value = "/{id}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeDto> uploadResume(
            @PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(candidateService.uploadResume(id, file));
    }

    @GetMapping("/{id}/resume/{resumeId}/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id, @PathVariable Long resumeId) {
        Resource resource = candidateService.downloadResume(id, resumeId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}/resume/{resumeId}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id, @PathVariable Long resumeId) {
        candidateService.deleteResume(id, resumeId);
        return ResponseEntity.ok(Map.of("message", "Resume removed successfully"));
    }

    // Profile Picture
    @PostMapping(value = "/{id}/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String path = candidateService.uploadProfilePicture(id, file);
        return ResponseEntity.ok(Map.of("message", "Profile picture uploaded", "path", path));
    }

    // PDF CV Generation
    @GetMapping("/{id}/profile/pdf")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportCvPdf(@PathVariable Long id) {
        // Use the query that eagerly fetches the user to avoid lazy loading issues
        CandidateProfile profile = candidateProfileRepository.findByIdWithUser(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate Profile", "id", id));

        // Authorization check: Candidate themselves, Employer, Recruitment Officer, or Admin can download
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedException("Authentication required to download CV");
        }
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        boolean isSelf = profile.getUser().getId().equals(user.getId());
        boolean hasStaffOrEmployerRole = user.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_EMPLOYER") ||
                a.getAuthority().equals("ROLE_RECRUITMENT_OFFICER") ||
                a.getAuthority().equals("ROLE_OPERATIONS_EXECUTIVE") ||
                a.getAuthority().equals("ROLE_ADMIN"));

        if (!isSelf && !hasStaffOrEmployerRole) {
            throw new UnauthorizedException("You are not authorized to download this candidate's CV");
        }

        byte[] pdfBytes = pdfCvGeneratorService.generateCandidateCvPdf(profile);

        String safeCandidateName = profile.getUser().getFullName() != null ?
                profile.getUser().getFullName().replaceAll("\\s+", "_") : "Candidate";
        String filename = safeCandidateName + "_JobConnect_CV.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(pdfBytes);
    }
}
