package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.util.List;

public class CareerReadinessDto {
    private Long id;
    private Long sessionId;
    private BigDecimal readinessScore;
    private String readinessLevel; // NOT READY, BEGINNER READY, INTERVIEW READY, JOB READY
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> recommendations;
    private List<SkillGapDto> skillGaps;

    public CareerReadinessDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public BigDecimal getReadinessScore() { return readinessScore; }
    public void setReadinessScore(BigDecimal readinessScore) { this.readinessScore = readinessScore; }
    public String getReadinessLevel() { return readinessLevel; }
    public void setReadinessLevel(String readinessLevel) { this.readinessLevel = readinessLevel; }
    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }
    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    public List<SkillGapDto> getSkillGaps() { return skillGaps; }
    public void setSkillGaps(List<SkillGapDto> skillGaps) { this.skillGaps = skillGaps; }
}
