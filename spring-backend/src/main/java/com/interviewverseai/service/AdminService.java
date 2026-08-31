package com.interviewverseai.service;

import com.interviewverseai.dto.AdminDashboardDto;
import com.interviewverseai.dto.CandidateOverviewDto;
import com.interviewverseai.dto.InterviewSessionDto;
import com.interviewverseai.model.CandidateProfile;
import com.interviewverseai.model.InterviewSession;
import com.interviewverseai.model.SkillAssessment;
import com.interviewverseai.model.User;
import com.interviewverseai.repository.CandidateProfileRepository;
import com.interviewverseai.repository.InterviewSessionRepository;
import com.interviewverseai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final InterviewSessionRepository sessionRepository;
    private final InterviewService interviewService;

    public AdminService(
            UserRepository userRepository,
            CandidateProfileRepository profileRepository,
            InterviewSessionRepository sessionRepository,
            InterviewService interviewService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.sessionRepository = sessionRepository;
        this.interviewService = interviewService;
    }

    public AdminDashboardDto getDashboardStats() {
        List<User> candidates = userRepository.findByRole("CANDIDATE");
        long totalCandidates = candidates.size();
        long completedInterviews = sessionRepository.countByStatus("COMPLETED");

        BigDecimal avgScore = sessionRepository.findAverageScore();
        if (avgScore == null) avgScore = BigDecimal.valueOf(78.5);
        avgScore = avgScore.setScale(2, RoundingMode.HALF_UP);

        long jobReady = 0;
        long interviewReady = 0;
        long beginnerReady = 0;
        long needsImprovement = 0;

        List<CandidateOverviewDto> table = new ArrayList<>();

        for (User c : candidates) {
            CandidateProfile profile = profileRepository.findByUserId(c.getId()).orElse(null);
            List<InterviewSession> sessions = sessionRepository.findByCandidateIdOrderByStartedAtDesc(c.getId());

            CandidateOverviewDto row = new CandidateOverviewDto();
            row.setCandidateId(c.getId());
            row.setCandidateName(c.getName());
            row.setEmail(c.getEmail());
            row.setJobRole(profile != null ? profile.getTargetRole() : "Software Developer");

            if (!sessions.isEmpty()) {
                InterviewSession lastSession = sessions.get(0);
                row.setLastSessionId(lastSession.getId());
                row.setLastInterviewType(lastSession.getInterviewType());
                row.setStatus(lastSession.getStatus());
                row.setOverallScore(lastSession.getOverallScore());

                SkillAssessment sa = lastSession.getSkillAssessment();
                if (sa != null) {
                    row.setTechnicalScore(sa.getTechnicalScore());
                    row.setProblemSolvingScore(sa.getProblemSolvingScore());
                    row.setCommunicationScore(sa.getCommunicationScore());
                    row.setBehavioralScore(sa.getBehavioralScore());
                } else {
                    row.setTechnicalScore(lastSession.getOverallScore());
                    row.setProblemSolvingScore(lastSession.getOverallScore());
                    row.setCommunicationScore(lastSession.getOverallScore());
                    row.setBehavioralScore(lastSession.getOverallScore());
                }

                if (lastSession.getCareerReadiness() != null) {
                    row.setReadinessLevel(lastSession.getCareerReadiness().getReadinessLevel());
                } else {
                    double s = lastSession.getOverallScore().doubleValue();
                    if (s >= 80) row.setReadinessLevel("JOB READY");
                    else if (s >= 60) row.setReadinessLevel("INTERVIEW READY");
                    else if (s >= 40) row.setReadinessLevel("BEGINNER READY");
                    else row.setReadinessLevel("NOT READY");
                }
            } else {
                row.setStatus("PENDING");
                row.setOverallScore(BigDecimal.ZERO);
                row.setTechnicalScore(BigDecimal.ZERO);
                row.setProblemSolvingScore(BigDecimal.ZERO);
                row.setCommunicationScore(BigDecimal.ZERO);
                row.setBehavioralScore(BigDecimal.ZERO);
                row.setReadinessLevel("NOT READY");
            }

            // Count Readiness Buckets
            String rLevel = row.getReadinessLevel();
            if ("JOB READY".equalsIgnoreCase(rLevel)) jobReady++;
            else if ("INTERVIEW READY".equalsIgnoreCase(rLevel)) interviewReady++;
            else if ("BEGINNER READY".equalsIgnoreCase(rLevel)) beginnerReady++;
            else needsImprovement++;

            table.add(row);
        }

        AdminDashboardDto dto = new AdminDashboardDto();
        dto.setTotalCandidates(totalCandidates);
        dto.setCompletedInterviews(completedInterviews);
        dto.setAverageScore(avgScore);
        dto.setJobReadyCount(jobReady);
        dto.setInterviewReadyCount(interviewReady);
        dto.setBeginnerReadyCount(beginnerReady);
        dto.setNeedsImprovementCount(needsImprovement);
        dto.setCandidateTable(table);

        return dto;
    }

    public List<CandidateOverviewDto> getAllCandidates() {
        return getDashboardStats().getCandidateTable();
    }

    public List<InterviewSessionDto> getAllInterviews() {
        List<InterviewSession> allSessions = sessionRepository.findAll();
        return allSessions.stream().map(s -> interviewService.getSessionById(s.getId())).collect(Collectors.toList());
    }
}
