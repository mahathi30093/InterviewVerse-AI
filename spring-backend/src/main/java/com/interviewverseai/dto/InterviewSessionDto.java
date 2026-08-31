package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public class InterviewSessionDto {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private String interviewType;
    private String jobRole;
    private String status;
    private String currentDifficulty;
    private OffsetDateTime startedAt;
    private OffsetDateTime completedAt;
    private BigDecimal overallScore;
    private List<InterviewQuestionDto> questions;
    private SkillAssessmentDto skillAssessment;
    private CareerReadinessDto careerReadiness;

    public InterviewSessionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }
    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCurrentDifficulty() { return currentDifficulty; }
    public void setCurrentDifficulty(String currentDifficulty) { this.currentDifficulty = currentDifficulty; }
    public OffsetDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }
    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }
    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }
    public List<InterviewQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<InterviewQuestionDto> questions) { this.questions = questions; }
    public SkillAssessmentDto getSkillAssessment() { return skillAssessment; }
    public void setSkillAssessment(SkillAssessmentDto skillAssessment) { this.skillAssessment = skillAssessment; }
    public CareerReadinessDto getCareerReadiness() { return careerReadiness; }
    public void setCareerReadiness(CareerReadinessDto careerReadiness) { this.careerReadiness = careerReadiness; }
}
