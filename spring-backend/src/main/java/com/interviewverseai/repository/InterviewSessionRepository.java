package com.interviewverseai.repository;

import com.interviewverseai.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByCandidateIdOrderByStartedAtDesc(Long candidateId);
    Optional<InterviewSession> findFirstByCandidateIdAndStatusOrderByStartedAtDesc(Long candidateId, String status);
    
    long countByStatus(String status);
    
    @Query("SELECT AVG(s.overallScore) FROM InterviewSession s WHERE s.status = 'COMPLETED' AND s.overallScore > 0")
    BigDecimal findAverageScore();

    @Query("SELECT AVG(s.overallScore) FROM InterviewSession s WHERE s.candidate.id = :candidateId AND s.status = 'COMPLETED'")
    BigDecimal findAverageScoreByCandidateId(Long candidateId);

    @Query("SELECT MAX(s.overallScore) FROM InterviewSession s WHERE s.candidate.id = :candidateId AND s.status = 'COMPLETED'")
    BigDecimal findMaxScoreByCandidateId(Long candidateId);
}
