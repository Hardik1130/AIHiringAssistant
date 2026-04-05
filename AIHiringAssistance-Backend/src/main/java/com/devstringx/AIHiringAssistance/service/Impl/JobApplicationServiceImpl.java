package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.entity.JobApplication;
import com.devstringx.AIHiringAssistance.modal.entity.JobEntity;
import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import com.devstringx.AIHiringAssistance.modal.request.ApplicantFilterRequest;
import com.devstringx.AIHiringAssistance.modal.response.*;
import com.devstringx.AIHiringAssistance.repository.*;
import com.devstringx.AIHiringAssistance.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final JobRepository jobRepo;
    private final UserRepository userRepo;
    private final JDScoreRepository jdScoreRepository;

    @Override
    public JobApplicantsResponseDTO getApplicantsByJobId(String jobId) {
        return null;
    }

    @Override
    public JobApplicantsResponseDTO getFilteredApplicants(ApplicantFilterRequest filter, int page, int size) {

        JobEntity job = jobRepo.findByJobId(filter.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        List<JobApplication> applications = jobApplicationRepository.findByJob_JobId(job.getJobId());

        List<ApplicantDTO> filteredApplicants = applications.stream()
                .map(app -> {
                    UserEntity user = userRepo.findByUserId(app.getUserId()).orElse(null);
                    CandidateProfile profile = candidateProfileRepository.findByUserId(app.getUserId()).orElse(null);
//                    Double aiScore = (profile != null) ? jdScoreRepository.findOverallScoreByJobAndCandidate(job.getId(), profile.getId()) : 0.0;

                    // Fixed: Handle null return from repository
                    Double aiScore = (profile != null)
                            ? jdScoreRepository.findOverallScoreByJobIdAndCandidateId(job.getId(), profile.getId())
                            .orElse(0.0)
                            : 0.0;

                    return ApplicantDTO.builder()
                            .userId(profile.getUserId())
                            .applicationId(app.getApplicationId())
                            .fullname(user != null ? user.getFullName() : "Unknown")
                            .location(profile != null ? profile.getLocation() : "N/A")
                            .currentRole(profile != null ? profile.getCurrentRole() : "N/A")
                            .aiScore(aiScore)
                            .totalExperience(profile != null ? profile.getTotalExperience() : 0)
                            .topSkills(profile != null ? profile.getSkills() : "")
                            .education(profile != null ? profile.getHighestEducation() : "")
                            .resumeUrl(profile.getResumeFilePath())
                            .avatar(profile.getAvatar())
                            .email(user.getEmail())
                            .build();
                })
                .filter(dto -> isScoreInRanges(dto.getAiScore(), filter.getScoreRanges()))

                .filter(dto -> filter.getExperience() == null || dto.getTotalExperience() >= filter.getExperience())

                .filter(dto -> {
                    if (filter.getTopSkills() == null || filter.getTopSkills().isEmpty()) return true;
                    String applicantSkills = dto.getTopSkills().toLowerCase();
                    return filter.getTopSkills().stream()
                            .anyMatch(skill -> applicantSkills.contains(skill.toLowerCase()));
                })

                .filter(dto -> {
                    if (filter.getEducationLevel() == null || filter.getEducationLevel().isEmpty()) return true;
                    if (dto.getEducation() == null) return false;

                    return dto.getEducation().toLowerCase().contains(filter.getEducationLevel().toLowerCase());
                }).collect(Collectors.toList());

        int totalCount = filteredApplicants.size();

        int totalPages = (int) Math.ceil((double) totalCount / size);

        List<ApplicantDTO> paginatedApplicants = filteredApplicants.stream()
                .skip((long) page * size)
                .limit(size)
                .collect(Collectors.toList());

        return JobApplicantsResponseDTO.builder()
                .jobDetails(JobSummaryDTO.builder().jobId(job.getJobId()).title(job.getTitle()).build())
                .applicants(paginatedApplicants)
                .totalApplicants((long) totalCount)
                .totalPages(totalPages)
                .currentPage(page)
                .pageSize(size)
                .isLast(page >= totalPages - 1)
                .build();
    }

    private boolean isScoreInRanges(Double score, List<String> ranges) {
        if (ranges == null || ranges.isEmpty()) return true;
        if (score == null) return false;

        for (String range : ranges) {
            if (range.contains("90") && score >= 90) return true;
            if (range.contains("70-90") && score >= 70 && score < 90) return true;
            if (range.contains("< 70") && score < 70) return true;
        }
        return false;
    }
}