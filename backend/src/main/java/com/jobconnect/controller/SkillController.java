package com.jobconnect.controller;

import com.jobconnect.dto.candidate.SkillDto;
import com.jobconnect.service.CandidateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final CandidateService candidateService;

    public SkillController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping
    public ResponseEntity<List<SkillDto>> searchSkills(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(candidateService.searchAvailableSkills(query));
    }
}
