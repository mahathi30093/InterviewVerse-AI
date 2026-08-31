package com.interviewverseai.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardDto {
    private long totalCandidates;
    private long completedInterviews;
    private BigDecimal averageScore;
    private long jobReadyCount;
    private long interviewReadyCount;
    private long beginnerReadyCount;
    private long needsImprovementCount;
    private List<CandidateOverviewDto> candidateTable;

    public AdminDashboardDto() {}

    public long getTotalCandidates() { return totalCandidates; }
    public void setTotalCandidates(long totalCandidates) { this.totalCandidates = totalCandidates; }
    public long getCompletedInterviews() { return completedInterviews; }
    public void setCompletedInterviews(long completedInterviews) { this.completedInterviews = completedInterviews; }
    public BigDecimal getAverageScore() { return averageScore; }
    public void setAverageScore(BigDecimal averageScore) { this.averageScore = averageScore; }
    public long getJobReadyCount() { return jobReadyCount; }
    public void setJobReadyCount(long jobReadyCount) { this.jobReadyCount = jobReadyCount; }
    public long getInterviewReadyCount() { return interviewReadyCount; }
    public void setInterviewReadyCount(long interviewReadyCount) { this.interviewReadyCount = interviewReadyCount; }
    public long getBeginnerReadyCount() { return beginnerReadyCount; }
    public void setBeginnerReadyCount(long beginnerReadyCount) { this.beginnerReadyCount = beginnerReadyCount; }
    public long getNeedsImprovementCount() { return needsImprovementCount; }
    public void setNeedsImprovementCount(long needsImprovementCount) { this.needsImprovementCount = needsImprovementCount; }
    public List<CandidateOverviewDto> getCandidateTable() { return candidateTable; }
    public void setCandidateTable(List<CandidateOverviewDto> candidateTable) { this.candidateTable = candidateTable; }
}
