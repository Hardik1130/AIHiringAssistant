package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import com.devstringx.AIHiringAssistance.modal.response.DashboardResponse;
import com.devstringx.AIHiringAssistance.modal.response.DashboardUsers;
import com.devstringx.AIHiringAssistance.repository.CandidateProfileRepository;
import com.devstringx.AIHiringAssistance.repository.JobApplicationRepository;
import com.devstringx.AIHiringAssistance.repository.JobRepository;
import com.devstringx.AIHiringAssistance.repository.UserRepository;
import com.devstringx.AIHiringAssistance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CandidateProfileRepository candidateRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public DashboardResponse getAllDataforDashboard() {
        // 1. Fetch Top 3 Candidates by match percentage
        List<CandidateProfile> topCandidates = candidateRepository.findTop3ByOrderByMatchPercentageDesc();

        // 2. Map CandidateProfile + UserEntity -> DashboardUsers
        List<DashboardUsers> dashboardUsersList = topCandidates.stream()
                .map(profile -> {
                    // Fetch the user to get the full name using the userId string
                    UserEntity user = userRepository.findByUserId(profile.getUserId())
                            .orElse(null);

                    return DashboardUsers.builder()
                            .fullName(user != null ? user.getFullName() : "Unknown")
                            .currentRole(profile.getCurrentRole())
                            .matchPercentage(profile.getMatchPercentage())
                            .avatar(profile.getAvatar())
                            .build();
                })
                .collect(Collectors.toList());

        // 3. Build and return the final response
        return DashboardResponse.builder()
                .totalJobs((int) jobRepository.countByFinalizedTrue())
                .totalUsers((int) userRepository.count())
                .totalApplicantions((int) jobApplicationRepository.count())
                .dashboardUsersList(dashboardUsersList)
                .build();
    }
}