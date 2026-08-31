package com.interviewverseai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "interview_answers")
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false, unique = true)
    @JsonIgnore
    private InterviewQuestion question;

    @Column(name = "answer_text", nullable = false, columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "audio_path", length = 500)
    private String audioPath;

    @Column(columnDefinition = "TEXT")
    private String transcription;

    @Column(precision = 5, scale = 2)
    private BigDecimal score = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    private BigDecimal correctness = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    private BigDecimal relevance = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    private BigDecimal completeness = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public InterviewAnswer() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InterviewQuestion getQuestion() {
        return question;
    }

    public void setQuestion(InterviewQuestion question) {
        this.question = question;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public String getAudioPath() {
        return audioPath;
    }

    public void setAudioPath(String audioPath) {
        this.audioPath = audioPath;
    }

    public String getTranscription() {
        return transcription;
    }

    public void setTranscription(String transcription) {
        this.transcription = transcription;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public BigDecimal getCorrectness() {
        return correctness;
    }

    public void setCorrectness(BigDecimal correctness) {
        this.correctness = correctness;
    }

    public BigDecimal getRelevance() {
        return relevance;
    }

    public void setRelevance(BigDecimal relevance) {
        this.relevance = relevance;
    }

    public BigDecimal getCompleteness() {
        return completeness;
    }

    public void setCompleteness(BigDecimal completeness) {
        this.completeness = completeness;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
