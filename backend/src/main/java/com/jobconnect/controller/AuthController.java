package com.jobconnect.controller;

import com.jobconnect.dto.auth.*;
import com.jobconnect.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register/candidate")
    public ResponseEntity<AuthResponse> registerCandidate(@Valid @RequestBody RegisterCandidateRequest request) {
        return ResponseEntity.ok(authService.registerCandidate(request));
    }

    @PostMapping("/register/employer")
    public ResponseEntity<AuthResponse> registerEmployer(@Valid @RequestBody RegisterEmployerRequest request) {
        return ResponseEntity.ok(authService.registerEmployer(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        boolean verified = authService.verifyEmail(token);
        return ResponseEntity.ok().body("{\"message\":\"Email verified successfully\",\"verified\":" + verified + "}");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        authService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok().body("{\"message\":\"If an account exists with that email, password reset instructions have been dispatched.\"}");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        boolean reset = authService.resetPassword(request);
        return ResponseEntity.ok().body("{\"message\":\"Password updated successfully\",\"success\":" + reset + "}");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}
