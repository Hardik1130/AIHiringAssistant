package com.devstringx.AIHiringAssistance.repository;

import com.devstringx.AIHiringAssistance.modal.entity.ResumeParsingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeParsingResultRepository
        extends JpaRepository<ResumeParsingResult, Long> {

    Optional<ResumeParsingResult> findByUserId(String userId);

    boolean existsByUserId(String userId);
}
