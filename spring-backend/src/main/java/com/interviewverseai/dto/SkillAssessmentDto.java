package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.util.List;

public class SkillAssessmentDto {
    private Long id;
    private Long sessionId;
    private BigDecimal technicalScore;
    private BigDecimal problemSolvingScore;
    private BigDecimal communicationScore;
    private BigDecimal behavioralScore;
    private BigDecimal overallScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<SkillGapDto> skillGaps;

    public SkillAssessmentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
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
    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }
    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }
    public List<SkillGapDto> getSkillGaps() { return skillGaps; }
    public void setSkillGaps(List<SkillGapDto> skillGaps) { this.skillGaps = skillGaps; }
}
