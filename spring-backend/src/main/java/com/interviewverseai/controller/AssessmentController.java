package com.interviewverseai.controller;

import com.interviewverseai.dto.AssessmentResponseDto;
import com.interviewverseai.dto.CareerReadinessDto;
import com.interviewverseai.dto.SkillAssessmentDto;
import com.interviewverseai.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<AssessmentResponseDto> getAssessment(@PathVariable("sessionId") Long sessionId) {
        return ResponseEntity.ok(assessmentService.getAssessment(sessionId));
    }

    @GetMapping("/{sessionId}/skills")
    public ResponseEntity<SkillAssessmentDto> getSkillAssessment(@PathVariable("sessionId") Long sessionId) {
        return ResponseEntity.ok(assessmentService.getSkillAssessment(sessionId));
    }

    @GetMapping("/{sessionId}/career-readiness")
    public ResponseEntity<CareerReadinessDto> getCareerReadiness(@PathVariable("sessionId") Long sessionId) {
        return ResponseEntity.ok(assessmentService.getCareerReadiness(sessionId));
    }
}
