package com.interviewverseai.repository;

import com.interviewverseai.model.SkillAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SkillAssessmentRepository extends JpaRepository<SkillAssessment, Long> {
    Optional<SkillAssessment> findBySessionId(Long sessionId);
}
