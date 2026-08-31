package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.util.List;

public class AssessmentResponseDto {
    private Long sessionId;
    private String candidateName;
    private String jobRole;
    private String interviewType;
    private BigDecimal overallScore;
    private SkillAssessmentDto skillAssessment;
    private CareerReadinessDto careerReadiness;
    private List<SkillGapDto> skillGaps;
    private List<InterviewQuestionDto> questions;

    public AssessmentResponseDto() {}

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }
    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }
    public SkillAssessmentDto getSkillAssessment() { return skillAssessment; }
    public void setSkillAssessment(SkillAssessmentDto skillAssessment) { this.skillAssessment = skillAssessment; }
    public CareerReadinessDto getCareerReadiness() { return careerReadiness; }
    public void setCareerReadiness(CareerReadinessDto careerReadiness) { this.careerReadiness = careerReadiness; }
    public List<SkillGapDto> getSkillGaps() { return skillGaps; }
    public void setSkillGaps(List<SkillGapDto> skillGaps) { this.skillGaps = skillGaps; }
    public List<InterviewQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<InterviewQuestionDto> questions) { this.questions = questions; }
}
