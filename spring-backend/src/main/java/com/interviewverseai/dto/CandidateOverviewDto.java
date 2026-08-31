package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.util.List;

public class CandidateOverviewDto {
    private Long candidateId;
    private String candidateName;
    private String email;
    private String jobRole;
    private Long lastSessionId;
    private String lastInterviewType;
    private BigDecimal technicalScore;
    private BigDecimal problemSolvingScore;
    private BigDecimal communicationScore;
    private BigDecimal behavioralScore;
    private BigDecimal overallScore;
    private String readinessLevel;
    private String status;

    public CandidateOverviewDto() {}

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }
    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public Long getLastSessionId() { return lastSessionId; }
    public void setLastSessionId(Long lastSessionId) { this.lastSessionId = lastSessionId; }
    public String getLastInterviewType() { return lastInterviewType; }
    public void setLastInterviewType(String lastInterviewType) { this.lastInterviewType = lastInterviewType; }
    public BigDecimal getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(BigDecimal technicalScore) { this.technicalScore = technicalScore; }
    public BigDecimal getProblemSolvingScore() { return problemSolvingScore; }
    public void setProblemSolvingScore(BigDecimal problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; }
    public BigDecimal getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(BigDecimal communicationScore) { this.communicationScore = communicationScore; }
    public BigDecimal getBehavioralScore() { return behavioralScore; }
    public void setBehavioralScore(BigDecimal behavioralScore) { this.behavioralScore = behavioralScore; }
    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }
    public String getReadinessLevel() { return readinessLevel; }
    public void setReadinessLevel(String readinessLevel) { this.readinessLevel = readinessLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
