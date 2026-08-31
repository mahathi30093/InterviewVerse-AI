package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public class InterviewStartRequest {
    private String jobRole = "Software Developer";
    private String interviewType = "Mixed"; // Technical, Problem Solving, Communication, Behavioral, Mixed
    private String initialDifficulty = "EASY";

    public InterviewStartRequest() {}

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }
    public String getInitialDifficulty() { return initialDifficulty; }
    public void setInitialDifficulty(String initialDifficulty) { this.initialDifficulty = initialDifficulty; }
}
