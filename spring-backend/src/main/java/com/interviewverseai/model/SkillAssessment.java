package com.interviewverseai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "skill_assessments")
public class SkillAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    @JsonIgnore
    private InterviewSession session;

    @Column(name = "technical_score", precision = 5, scale = 2)
    private BigDecimal technicalScore = BigDecimal.ZERO;

    @Column(name = "problem_solving_score", precision = 5, scale = 2)
    private BigDecimal problemSolvingScore = BigDecimal.ZERO;

    @Column(name = "communication_score", precision = 5, scale = 2)
    private BigDecimal communicationScore = BigDecimal.ZERO;

    @Column(name = "behavioral_score", precision = 5, scale = 2)
    private BigDecimal behavioralScore = BigDecimal.ZERO;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public SkillAssessment() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InterviewSession getSession() {
        return session;
    }

    public void setSession(InterviewSession session) {
        this.session = session;
    }

    public BigDecimal getTechnicalScore() {
        return technicalScore;
    }

    public void setTechnicalScore(BigDecimal technicalScore) {
        this.technicalScore = technicalScore;
    }

    public BigDecimal getProblemSolvingScore() {
        return problemSolvingScore;
    }

    public void setProblemSolvingScore(BigDecimal problemSolvingScore) {
        this.problemSolvingScore = problemSolvingScore;
    }

    public BigDecimal getCommunicationScore() {
        return communicationScore;
    }

    public void setCommunicationScore(BigDecimal communicationScore) {
        this.communicationScore = communicationScore;
    }

    public BigDecimal getBehavioralScore() {
        return behavioralScore;
    }

    public void setBehavioralScore(BigDecimal behavioralScore) {
        this.behavioralScore = behavioralScore;
    }

    public BigDecimal getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(BigDecimal overallScore) {
        this.overallScore = overallScore;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
