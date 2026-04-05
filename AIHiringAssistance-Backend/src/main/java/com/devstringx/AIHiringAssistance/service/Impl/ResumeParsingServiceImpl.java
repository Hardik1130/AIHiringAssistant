package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.AILayer.AIClient;
import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.entity.ResumeParsingResult;
import com.devstringx.AIHiringAssistance.repository.CandidateProfileRepository;
import com.devstringx.AIHiringAssistance.repository.ResumeParsingResultRepository;
import com.devstringx.AIHiringAssistance.service.ResumeParsingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeParsingServiceImpl implements ResumeParsingService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final ResumeParsingResultRepository resumeParsingResultRepository;
    private final AIClient aiClient;

    @Override
    public ResumeParsingResult parseResume(String userId) {

        // 1️⃣ Fetch candidate profile
        CandidateProfile candidate = candidateProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        if (candidate.getResumeText() == null || candidate.getResumeText().isEmpty()) {
            throw new RuntimeException("Resume text not available for parsing");
        }

        // 2️⃣ Call AI parser
        Map<String, Object> aiResponse =
                aiClient.parseResume(candidate.getResumeText());

        // 3️⃣ Build parsing result entity
        ResumeParsingResult parsingResult = ResumeParsingResult.builder()
                .userId(userId)
                .extractedSkills((String) aiResponse.get("skills"))
                .extractedExperience((String) aiResponse.get("experience"))
                .extractedEducation((String) aiResponse.get("education"))
                .extractedCertifications((String) aiResponse.get("certifications"))
                .confidenceScore((Double) aiResponse.get("confidenceScore"))
                .build();

        // 4️⃣ Save & return
        return resumeParsingResultRepository.save(parsingResult);
    }
}

