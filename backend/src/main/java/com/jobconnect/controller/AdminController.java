package com.jobconnect.controller;

import com.jobconnect.dto.admin.*;
import com.jobconnect.dto.auth.UserDto;
import com.jobconnect.dto.job.JobResponseDto;
import com.jobconnect.entity.EmployerProfile;
import com.jobconnect.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping({"/employers/pending", "/employers/pending-verification"})
    public ResponseEntity<Page<EmployerProfile>> getPendingEmployers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.getPendingEmployerVerifications(pageable));
    }

    @RequestMapping(value = {"/employers/{id}/verify", "/employers/{id}/review"}, method = {RequestMethod.POST, RequestMethod.PATCH})
    public ResponseEntity<?> verifyEmployer(
            @PathVariable Long id,
            @RequestBody(required = false) VerifyEmployerDto bodyDto,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) String rejectionReason) {
        VerifyEmployerDto dto = bodyDto != null ? bodyDto : new VerifyEmployerDto();
        if (action != null) dto.setAction(action);
        else if (status != null) dto.setStatus(status);
        if (rejectionReason != null) dto.setRejectionReason(rejectionReason);
        else if (notes != null) dto.setNotes(notes);
        adminService.verifyEmployer(id, dto);
        return ResponseEntity.ok(Map.of("message", "Employer verification status updated successfully"));
    }

    @GetMapping("/jobs/pending")
    public ResponseEntity<Page<JobResponseDto>> getPendingJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.getPendingJobReviews(pageable));
    }

    @PostMapping("/jobs/{id}/review")
    public ResponseEntity<?> reviewJob(
            @PathVariable Long id, @Valid @RequestBody ReviewJobDto dto) {
        adminService.reviewJob(id, dto);
        return ResponseEntity.ok(Map.of("message", "Job review status updated successfully"));
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.getAllUsers(pageable, role, status, search));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id, @RequestParam String status) {
        adminService.updateUserStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "User account status updated successfully"));
    }

    @RequestMapping(value = {"/users/{id}/role", "/users/{id}/roles"}, method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestParam(required = false) String role,
            @RequestBody(required = false) Map<String, Object> body) {
        String roleVal = role;
        if (roleVal == null && body != null) {
            if (body.get("role") != null) roleVal = body.get("role").toString();
            else if (body.get("newRole") != null) roleVal = body.get("newRole").toString();
            else if (body.get("roles") != null) {
                Object r = body.get("roles");
                if (r instanceof java.util.List && !((java.util.List<?>) r).isEmpty()) {
                    roleVal = ((java.util.List<?>) r).get(0).toString();
                } else {
                    roleVal = r.toString();
                }
            }
        }
        if (roleVal == null || roleVal.isBlank()) {
            throw new com.jobconnect.exception.BadRequestException("Role parameter is required");
        }
        adminService.updateUserRole(id, roleVal);
        return ResponseEntity.ok(Map.of("message", "User role updated successfully", "role", roleVal));
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetUserPassword(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) String newPassword) {
        String password = newPassword;
        if (password == null && body != null) {
            if (body.get("newPassword") != null) password = body.get("newPassword").toString();
            else if (body.get("password") != null) password = body.get("password").toString();
        }
        if (password == null || password.isBlank()) {
            throw new com.jobconnect.exception.BadRequestException("New password cannot be empty");
        }
        adminService.resetUserPassword(id, password);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLogDto>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.getAuditLogs(pageable));
    }
}
