package com.devstringx.AIHiringAssistance.repository;

import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile,Long> {

    Optional<CandidateProfile> findByUserIdAndIsSoftDeleteFalse(String userId);

    // ✅ Check if active profile exists
    boolean existsByUserIdAndIsSoftDeleteFalse(String userId);

    Optional<CandidateProfile> findByUserId(String userId);

    // Finds top 3 profiles where matchPercentage is not null, sorted descending
    List<CandidateProfile> findTop3ByOrderByMatchPercentageDesc();
}
