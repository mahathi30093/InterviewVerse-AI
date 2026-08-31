package com.interviewverseai.controller;

import com.interviewverseai.dto.AnswerResponseDto;
import com.interviewverseai.dto.AnswerSubmissionDto;
import com.interviewverseai.dto.AssessmentResponseDto;
import com.interviewverseai.dto.InterviewSessionDto;
import com.interviewverseai.dto.InterviewStartRequest;
import com.interviewverseai.model.User;
import com.interviewverseai.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/start")
    public ResponseEntity<InterviewSessionDto> startInterview(
            @AuthenticationPrincipal User user,
            @RequestBody(required = false) InterviewStartRequest request) {
        if (user == null) return ResponseEntity.status(401).build();
        if (request == null) request = new InterviewStartRequest();
        return ResponseEntity.ok(interviewService.startInterview(user.getId(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewSessionDto> getInterviewSession(@PathVariable("id") Long sessionId) {
        return ResponseEntity.ok(interviewService.getSessionById(sessionId));
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<AnswerResponseDto> submitAnswer(
            @PathVariable("id") Long sessionId,
            @RequestBody AnswerSubmissionDto submission) {
        return ResponseEntity.ok(interviewService.submitAnswer(sessionId, submission));
    }

    @PostMapping(value = "/{id}/voice-answer", consumes = {"multipart/form-data"})
    public ResponseEntity<AnswerResponseDto> submitVoiceAnswer(
            @PathVariable("id") Long sessionId,
            @RequestParam("questionId") Long questionId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fallbackText", required = false) String fallbackText) {
        try {
            byte[] bytes = (file != null && !file.isEmpty()) ? file.getBytes() : null;
            String filename = file != null ? file.getOriginalFilename() : "audio.wav";
            return ResponseEntity.ok(interviewService.submitVoiceAnswer(sessionId, questionId, bytes, filename, fallbackText));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/next-question")
    public ResponseEntity<InterviewSessionDto> getNextQuestion(@PathVariable("id") Long sessionId) {
        return ResponseEntity.ok(interviewService.getSessionById(sessionId));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<AssessmentResponseDto> completeInterview(@PathVariable("id") Long sessionId) {
        return ResponseEntity.ok(interviewService.completeInterview(sessionId));
    }
}
