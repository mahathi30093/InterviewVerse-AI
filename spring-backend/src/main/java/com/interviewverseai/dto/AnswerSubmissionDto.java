package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnswerSubmissionDto {
    private Long questionId;
    private String answerText;

    public AnswerSubmissionDto() {}
    public AnswerSubmissionDto(Long questionId, String answerText) {
        this.questionId = questionId;
        this.answerText = answerText;
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
}
