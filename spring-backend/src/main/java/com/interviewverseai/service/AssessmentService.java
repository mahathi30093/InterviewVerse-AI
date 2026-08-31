package com.interviewverseai.service;

import com.interviewverseai.dto.AssessmentResponseDto;
import com.interviewverseai.dto.CareerReadinessDto;
import com.interviewverseai.dto.SkillAssessmentDto;
import org.springframework.stereotype.Service;

@Service
public class AssessmentService {

    private final InterviewService interviewService;

    public AssessmentService(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    public AssessmentResponseDto getAssessment(Long sessionId) {
        return interviewService.getSessionAssessment(sessionId);
    }

    public SkillAssessmentDto getSkillAssessment(Long sessionId) {
        AssessmentResponseDto full = interviewService.getSessionAssessment(sessionId);
        return full.getSkillAssessment();
    }

    public CareerReadinessDto getCareerReadiness(Long sessionId) {
        AssessmentResponseDto full = interviewService.getSessionAssessment(sessionId);
        return full.getCareerReadiness();
    }
}
