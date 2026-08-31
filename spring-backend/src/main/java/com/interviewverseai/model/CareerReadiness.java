package com.interviewverseai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "career_readiness")
public class CareerReadiness {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    @JsonIgnore
    private InterviewSession session;

    @Column(name = "readiness_score", precision = 5, scale = 2)
    private BigDecimal readinessScore = BigDecimal.ZERO;

    @Column(name = "readiness_level", nullable = false)
    private String readinessLevel = "BEGINNER READY"; // NOT READY, BEGINNER READY, INTERVIEW READY, JOB READY

    @Column(columnDefinition = "TEXT")
    private String strengths; // JSON string

    @Column(columnDefinition = "TEXT")
    private String weaknesses; // JSON string

    @Column(columnDefinition = "TEXT")
    private String recommendations; // JSON string

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public CareerReadiness() {}

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

    public BigDecimal getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(BigDecimal readinessScore) {
        this.readinessScore = readinessScore;
    }

    public String getReadinessLevel() {
        return readinessLevel;
    }

    public void setReadinessLevel(String readinessLevel) {
        this.readinessLevel = readinessLevel;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(String weaknesses) {
        this.weaknesses = weaknesses;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
