package com.devstringx.AIHiringAssistance.repository;

import com.devstringx.AIHiringAssistance.modal.entity.JDScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface JDScoreRepository extends JpaRepository<JDScore, Long> {

    boolean existsByJob_JobIdAndCandidate_UserId(
            String jobId,
            String userId
    );

    @Query("SELECT j.overallScore FROM JDScore j WHERE j.job.id = :jobId AND j.candidate.id = :candidateId")
    Optional<Double> findOverallScoreByJobIdAndCandidateId(
            @Param("jobId") Long jobId,
            @Param("candidateId") Long candidateId
    );
}
