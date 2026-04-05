package com.devstringx.AIHiringAssistance.repository;

import com.devstringx.AIHiringAssistance.modal.entity.JobApplication;
import com.devstringx.AIHiringAssistance.modal.entity.JobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication,Long> {
    boolean existsByJob_JobIdAndUserId(String jobId, String userId);

    long countByUserId(String userId);

    long countByJob(JobEntity job);

    List<JobApplication> findByJob_JobId(String jobId);

    // New method: Check if user has applied to a job
    boolean existsByJobIdAndUserId(Long jobId, String userId);



    // ─────────────────────────────────────────────────────────────────
    // Count applications submitted today (between midnight and now)
    // ─────────────────────────────────────────────────────────────────
    @Query("""
            SELECT COUNT(ja)
            FROM JobApplication ja
            WHERE ja.appliedAt >= :startOfDay
              AND ja.appliedAt <= :endOfDay
            """)
    long countApplicationsToday(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    // ─────────────────────────────────────────────────────────────────
    // Daily applicant counts for a given month & year
    // Returns list of Object[] where [0]=day(int), [1]=count(long)
    // ─────────────────────────────────────────────────────────────────
    @Query("""
            SELECT DAY(ja.appliedAt), COUNT(ja)
            FROM JobApplication ja
            WHERE MONTH(ja.appliedAt) = :month
              AND YEAR(ja.appliedAt)  = :year
            GROUP BY DAY(ja.appliedAt)
            ORDER BY DAY(ja.appliedAt) ASC
            """)
    List<Object[]> getDailyApplicantCountsForMonth(
            @Param("month") int month,
            @Param("year") int year
    );

    // ─────────────────────────────────────────────────────────────────
    // Total applications in a given month & year
    // ─────────────────────────────────────────────────────────────────
    @Query("""
            SELECT COUNT(ja)
            FROM JobApplication ja
            WHERE MONTH(ja.appliedAt) = :month
              AND YEAR(ja.appliedAt)  = :year
            """)
    long countApplicationsForMonth(
            @Param("month") int month,
            @Param("year") int year
    );

}
