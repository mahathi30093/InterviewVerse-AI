package com.interviewverseai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnore
    private User candidate;

    @Column(name = "interview_type", nullable = false)
    private String interviewType = "Mixed";

    @Column(name = "job_role", nullable = false)
    private String jobRole = "Software Developer";

    @Column(nullable = false)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "current_difficulty", nullable = false)
    private String currentDifficulty = "EASY"; // EASY, MEDIUM, HARD

    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt = OffsetDateTime.now();

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore = BigDecimal.ZERO;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceNumber ASC")
    private List<InterviewQuestion> questions = new ArrayList<>();

    @OneToOne(mappedBy = "session", cascade = CascadeType.ALL)
    private SkillAssessment skillAssessment;

    @OneToOne(mappedBy = "session", cascade = CascadeType.ALL)
    private CareerReadiness careerReadiness;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SkillGap> skillGaps = new ArrayList<>();

    public InterviewSession() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCurrentDifficulty() {
        return currentDifficulty;
    }

    public void setCurrentDifficulty(String currentDifficulty) {
        this.currentDifficulty = currentDifficulty;
    }

    public OffsetDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(OffsetDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public OffsetDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(OffsetDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public BigDecimal getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(BigDecimal overallScore) {
        this.overallScore = overallScore;
    }

    public List<InterviewQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<InterviewQuestion> questions) {
        this.questions = questions;
    }

    public SkillAssessment getSkillAssessment() {
        return skillAssessment;
    }

    public void setSkillAssessment(SkillAssessment skillAssessment) {
        this.skillAssessment = skillAssessment;
    }

    public CareerReadiness getCareerReadiness() {
        return careerReadiness;
    }

    public void setCareerReadiness(CareerReadiness careerReadiness) {
        this.careerReadiness = careerReadiness;
    }

    public List<SkillGap> getSkillGaps() {
        return skillGaps;
    }

    public void setSkillGaps(List<SkillGap> skillGaps) {
        this.skillGaps = skillGaps;
    }
}
