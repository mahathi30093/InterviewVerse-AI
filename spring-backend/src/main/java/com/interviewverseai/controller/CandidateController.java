package com.interviewverseai.controller;

import com.interviewverseai.dto.CandidateProfileDto;
import com.interviewverseai.dto.InterviewSessionDto;
import com.interviewverseai.model.User;
import com.interviewverseai.service.CandidateService;
import com.interviewverseai.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;
    private final InterviewService interviewService;

    public CandidateController(CandidateService candidateService, InterviewService interviewService) {
        this.candidateService = candidateService;
        this.interviewService = interviewService;
    }

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileDto> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(candidateService.getProfileByUserId(user.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<CandidateProfileDto> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody CandidateProfileDto dto) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(candidateService.updateProfile(user.getId(), dto));
    }

    @GetMapping("/history")
    public ResponseEntity<List<InterviewSessionDto>> getInterviewHistory(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(interviewService.getCandidateSessions(user.getId()));
    }
}
