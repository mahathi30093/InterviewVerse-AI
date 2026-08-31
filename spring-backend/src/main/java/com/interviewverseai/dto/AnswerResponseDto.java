package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnswerResponseDto {
    private Long answerId;
    private Long questionId;
    private BigDecimal score;
    private BigDecimal correctness;
    private BigDecimal relevance;
    private BigDecimal completeness;
    private String feedback;
    private List<String> strengths;
    private List<String> weaknesses;
    private String nextDifficulty;
    private InterviewQuestionDto nextQuestion;
    private boolean isInterviewComplete;

    public AnswerResponseDto() {}

    public Long getAnswerId() { return answerId; }
    public void setAnswerId(Long answerId) { this.answerId = answerId; }
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }
    public BigDecimal getCorrectness() { return correctness; }
    public void setCorrectness(BigDecimal correctness) { this.correctness = correctness; }
    public BigDecimal getRelevance() { return relevance; }
    public void setRelevance(BigDecimal relevance) { this.relevance = relevance; }
    public BigDecimal getCompleteness() { return completeness; }
    public void setCompleteness(BigDecimal completeness) { this.completeness = completeness; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }
    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }
    public String getNextDifficulty() { return nextDifficulty; }
    public void setNextDifficulty(String nextDifficulty) { this.nextDifficulty = nextDifficulty; }
    public InterviewQuestionDto getNextQuestion() { return nextQuestion; }
    public void setNextQuestion(InterviewQuestionDto nextQuestion) { this.nextQuestion = nextQuestion; }
    public boolean isInterviewComplete() { return isInterviewComplete; }
    public void setInterviewComplete(boolean interviewComplete) { isInterviewComplete = interviewComplete; }
}
