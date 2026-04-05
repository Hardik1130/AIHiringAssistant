package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.AILayer.AIJDGenerator;
//import com.devstringx.AIHiringAssistance.AILayer.AIResumeScoringClient;
import com.devstringx.AIHiringAssistance.AILayer.AIResumeScoringGeminiClient;
import com.devstringx.AIHiringAssistance.modal.entity.*;
import com.devstringx.AIHiringAssistance.modal.request.CurrentUserDetails;
import com.devstringx.AIHiringAssistance.modal.request.JobAIGenerateRequest;
import com.devstringx.AIHiringAssistance.modal.response.AIGeneratedJDResponse;
import com.devstringx.AIHiringAssistance.modal.response.AIScoreResponse;
import com.devstringx.AIHiringAssistance.modal.response.JobCardResponse;
import com.devstringx.AIHiringAssistance.repository.*;
import com.devstringx.AIHiringAssistance.service.AnalyticsService;
import com.devstringx.AIHiringAssistance.service.JobService;
import com.devstringx.AIHiringAssistance.util.LoggedInUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final AIJDGenerator aiJDGenerator;
    private final CandidateProfileRepository candidateProfileRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final JDScoreRepository jdScoreRepository;
    private final AIResumeScoringGeminiClient aiResumeScoringClient;
    private final RuleBasedScoreService ruleBasedScoreService;
    private final LoggedInUserContext loggedInUserContext;
    private final AnalyticsService analyticsService;

    public JobEntity generateAIDescription(
            JobAIGenerateRequest request,
            CurrentUserDetails currentUser
    ) {
        // 1️⃣ Prompt build
        String prompt = buildPrompt(request);

        // 2️⃣ Call AI
        AIGeneratedJDResponse aiResponse = aiJDGenerator.generateStructuredJD(prompt);

        // 3️⃣ Build Job Entity (Separated)
        JobEntity job = createJobEntity(request, aiResponse, currentUser);

        return jobRepository.save(job);
    }

    private JobEntity createJobEntity(
            JobAIGenerateRequest request,
            AIGeneratedJDResponse aiResponse,
            CurrentUserDetails currentUser
    ) {

        return JobEntity.builder()
                .jobId(UUID.randomUUID().toString())
                .title(request.getTitle())
                .department(request.getDepartment())
                .minExperience(request.getMinExperience())
                .maxExperience(request.getMaxExperience())
                .employmentType(request.getEmploymentType())
                .location(request.getLocation())
                .skillsRequired(String.join(",", request.getSkillsRequired()))
                .jobSummary(aiResponse.getJobSummary())
                .responsibilities(String.join("\n", aiResponse.getResponsibilities()))
                .qualifications(String.join("\n", aiResponse.getQualifications()))
//                .aiGeneratedJd(aiResponse.getFinalJd())
                .finalized(false)
                .createdBy(currentUser.getUserEntity()) // 🔴 IMPORTANT (see note)
                .build();
    }

    private String buildPrompt(JobAIGenerateRequest r) {
        return String.format("""
            Create a professional job description with:
            - Job Summary
            - Responsibilities
            - Required Skills
            - Qualifications
            - Experience

            Role: %s
            Department: %s
            Location: %s
            Employment Type: %s
            Experience: %d to %d years
            Skills: %s
        """,
                r.getTitle(),
                r.getDepartment(),
                r.getLocation(),
                r.getEmploymentType(),
                r.getMinExperience(),
                r.getMaxExperience(),
                String.join(", ", r.getSkillsRequired())
        );
    }

    @Override
    public JobEntity finalizeJob(String jobId, CurrentUserDetails currentUser) {

        JobEntity job = jobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // 🔐 Authorization: only creator HR can finalize
        if (!job.getCreatedBy().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("You are not authorized to finalize this JD");
        }

        // 🚫 Already finalized
        if (job.isFinalized()) {
            throw new RuntimeException("Job Description already finalized");
        }

        job.setFinalized(true);
        return jobRepository.save(job);
    }

    @Override
    public Map<String, Object> applyForJob(String jobId, CurrentUserDetails currentUser) {

        JobEntity job = jobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.isFinalized()) {
            throw new RuntimeException("Job is not open for applications");
        }

        CandidateProfile profile = candidateProfileRepository
                .findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("PROFILE_INCOMPLETE"));

        if (profile.getResumeFilePath().isEmpty()) {
            throw new RuntimeException("Complete Your Profile First");
        }

        boolean alreadyApplied = jobApplicationRepository
                .existsByJob_JobIdAndUserId(jobId, currentUser.getUserId());

        if (alreadyApplied) {
            throw new RuntimeException("You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .applicationId(UUID.randomUUID().toString())
                .job(job)
                .userId(profile.getUserId())
                .status("APPLIED")
                .build();

        jobApplicationRepository.save(application);

        long todayApplicantCount = analyticsService.getTodayApplicantCount();

        long appliedCount = jobApplicationRepository
                .countByUserId(currentUser.getUserId());

        // 🔥 AI Scoring + Save handled separately
        AIScoreResponse aiScore =
                processAIScoringAndSave(job, profile, currentUser);

        // 4️⃣ Response
        return Map.of(
                "applicationId", application.getApplicationId(),
                "jobId", jobId,
                "overallScore", aiScore.getOverallScore(),
                "appliedJobsCount", appliedCount
        );
    }

    private AIScoreResponse processAIScoringAndSave(
            JobEntity job,
            CandidateProfile profile,
            CurrentUserDetails currentUser
    ) {

        String jobJDText = aiResumeScoringClient.buildJDText(job);

        AIScoreResponse finalScore;
        boolean fallbackUsed = false;

        try {
            // 1️⃣ TRY AI SCORING
            finalScore =
                    aiResumeScoringClient.scoreResumeAgainstJD(
                            jobJDText,
                            profile.getResumeText()
                    );

        } catch (Exception aiEx) {

            // 2️⃣ LOG + FALLBACK
//            log.error(
//                    "AI scoring failed for jobId={}, userId={}. Falling back to rule-based scoring",
//                    job.getJobId(),
//                    currentUser.getUserId(),
//                    aiEx
//            );

            try {
                finalScore =
                        ruleBasedScoreService.score(
                                job,
                                profile.getResumeText()
                        );
                fallbackUsed = true;

            } catch (Exception ruleEx) {
                // 3️⃣ BOTH FAILED
                throw new RuntimeException(
                        "Both AI and rule-based scoring failed",
                        ruleEx
                );
            }
        }

        // 4️⃣ SAVE JDScore (UNCHANGED)
        JDScore score = JDScore.builder()
                .job(job)
                .candidate(currentUser.getUserEntity())
                .skillMatchScore(finalScore.getSkillMatchScore())
                .experienceMatchScore(finalScore.getExperienceMatchScore())
                .educationMatchScore(finalScore.getEducationMatchScore())
                .overallScore(finalScore.getOverallScore())
                .explanation(finalScore.getExplanation())
                .ruleBasedFallbackUsed(fallbackUsed)
                .build();

        jdScoreRepository.save(score);

        return finalScore;
    }

    public Page<JobCardResponse> getAllFinalizedJobs(int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<JobEntity> jobs = jobRepository.findByFinalizedTrue(pageable);

        List<JobCardResponse> response = jobs.getContent()
                .stream()
                .map(job -> {
                    Boolean hasApplied = jobApplicationRepository.existsByJobIdAndUserId(job.getId(), loggedInUserContext.getUserId());
                    long applicants = jobApplicationRepository.countByJob(job);

                    return JobCardResponse.builder()
                            .job(job)
                            .totalApplicants(applicants)
                            .hasApplied(hasApplied)
                            .posted(getPostedTime(job.getCreatedAt()))
                            .build();
                })
                .toList();

        return new PageImpl<>(response, pageable, jobs.getTotalElements());
    }

    private String getPostedTime(LocalDateTime createdAt) {

        long days = Duration.between(createdAt, LocalDateTime.now()).toDays();

        if (days == 0) return "Today";
        if (days == 1) return "1 day ago";

        return days + " days ago";
    }
}

