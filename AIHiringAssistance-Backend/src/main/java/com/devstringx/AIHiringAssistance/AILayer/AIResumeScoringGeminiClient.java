package com.devstringx.AIHiringAssistance.AILayer;

import com.devstringx.AIHiringAssistance.modal.entity.JobEntity;
import com.devstringx.AIHiringAssistance.modal.response.AIScoreResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AIResumeScoringGeminiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public AIScoreResponse scoreResumeAgainstJD(String jobJD, String resumeText) {

        try {
            String prompt = """
                You are an expert HR AI.

                Compare the following Job Description and Resume.
                Give scores between 0-100.

                Return ONLY valid JSON in this format:
                {
                  "skillMatchScore": number,
                  "experienceMatchScore": number,
                  "educationMatchScore": number,
                  "overallScore": number,
                  "explanation": "short explanation"
                }

                JOB DESCRIPTION:
                %s

                RESUME:
                %s
                """.formatted(jobJD, resumeText);

            // 🔹 Gemini Request Body
            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", prompt)
                                    )
                            )
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.3
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            // 🔹 API CALL
            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            geminiApiUrl + "?key=" + geminiApiKey,
                            entity,
                            String.class
                    );

            String aiJson = extractGeminiText(response.getBody());

            String cleanJson = sanitizeJson(aiJson);
            return objectMapper.readValue(cleanJson, AIScoreResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("Gemini AI scoring failed", e);
        }
    }

    public String extractGeminiText(String body) throws Exception {

        JsonNode root = objectMapper.readTree(body);

        JsonNode textNode = root
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text");

        if (textNode.isMissingNode()) {
            throw new RuntimeException("Invalid Gemini response: " + body);
        }

        return textNode.asText().trim();
    }

        public String buildJDText(JobEntity job) {
        return """
                Job Title: %s
                Department: %s
                Skills Required: %s
                Experience: %d - %d years

                Responsibilities:
                %s

                Qualifications:
                %s
                """.formatted(
                            job.getTitle(),
                            job.getDepartment(),
                            job.getSkillsRequired(),
                            job.getMinExperience(),
                            job.getMaxExperience(),
                            job.getResponsibilities(),
                            job.getQualifications()
                    );
    }

    private String sanitizeJson(String rawText) {

        rawText = rawText.trim();

        // Remove markdown ```json ``` or ```
        if (rawText.startsWith("```")) {
            rawText = rawText.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();
        }

        // Extract JSON block if extra text exists
        int start = rawText.indexOf("{");
        int end = rawText.lastIndexOf("}");

        if (start == -1 || end == -1) {
            throw new RuntimeException("AI did not return valid JSON: " + rawText);
        }

        return rawText.substring(start, end + 1);
    }
}

