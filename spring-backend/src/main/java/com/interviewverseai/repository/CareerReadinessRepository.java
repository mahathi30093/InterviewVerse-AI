package com.interviewverseai.repository;

import com.interviewverseai.model.CareerReadiness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CareerReadinessRepository extends JpaRepository<CareerReadiness, Long> {
    Optional<CareerReadiness> findBySessionId(Long sessionId);
}
