package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.modal.entity.JobEntity;
import com.devstringx.AIHiringAssistance.modal.response.AIScoreResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class RuleBasedScoreService {

    public AIScoreResponse score(JobEntity job, String resumeText) {

        Double skillScore = calculateSkillScore(job, resumeText);
        Double experienceScore = calculateExperienceScore(job, resumeText);
        Double educationScore = calculateEducationScore(resumeText);

        Double overallScore =
                (skillScore + experienceScore + educationScore) / 3.0;

        return AIScoreResponse.builder()
                .skillMatchScore(skillScore)
                .experienceMatchScore(experienceScore)
                .educationMatchScore(educationScore)
                .overallScore(round(overallScore))
                .explanation(
                        "Rule-based fallback used due to AI service unavailability"
                )
                .build();
    }

    // ---------------- RULES ----------------

    private Double calculateSkillScore(JobEntity job, String resumeText) {

        List<String> requiredSkills =
                Arrays.asList(job.getSkillsRequired().toLowerCase().split(","));

        long matchedSkills =
                requiredSkills.stream()
                        .filter(skill ->
                                resumeText.toLowerCase().contains(skill.trim()))
                        .count();

        if (requiredSkills.isEmpty()) {
            return 0.0;
        }

        return round((matchedSkills * 100.0) / requiredSkills.size());
    }

    private Double calculateExperienceScore(JobEntity job, String resumeText) {

        // Simple & explainable heuristic
        if (resumeText.matches(".*\\b([5-9]|1[0-9])\\s+years?\\b.*")) {
            return 90.0;
        }
        if (resumeText.matches(".*\\b([2-4])\\s+years?\\b.*")) {
            return 70.0;
        }
        return 40.0;
    }

    private Double calculateEducationScore(String resumeText) {

        String text = resumeText.toLowerCase();

        if (text.contains("m.tech") || text.contains("master")) {
            return 90.0;
        }
        if (text.contains("b.tech") || text.contains("bachelor") || text.contains("degree")) {
            return 70.0;
        }
        return 40.0;
    }

    private Double round(Double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}

