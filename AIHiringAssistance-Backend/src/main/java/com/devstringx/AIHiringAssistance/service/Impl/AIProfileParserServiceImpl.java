package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.modal.response.AIParsedProfileResponse;
import com.devstringx.AIHiringAssistance.service.AIProfileParserService;
import com.devstringx.AIHiringAssistance.service.GeminiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIProfileParserServiceImpl implements AIProfileParserService {

    private final GeminiService geminiService;

    @Override
    public AIParsedProfileResponse parseResume(String resumeText, String resumeUrl) {

        try {

            String prompt = """
                    You are an AI Resume Analyzer.
                    
                    Analyze the resume and return STRICT JSON.
                    
                    CRITICAL RULES (MUST FOLLOW):
                    1. Return ONLY raw JSON.
                    2. Do NOT wrap JSON in markdown.
                    3. Do NOT use ```json or ``` anywhere.
                    4. Do NOT add explanations, comments, or text outside JSON.
                    5. The response MUST start with { and end with }.
                    6. Output must be valid JSON parsable by Jackson ObjectMapper.
                    7. Follow the structure EXACTLY as defined below.
                    8. Do NOT rename fields.
                    9. Do NOT add extra fields.
                    10. skills MUST be a flat array of strings.
                    11. matchPercentage MUST be a NUMBER (not string).
                    
                    matchPercentage represents PROFILE STRENGTH (0-100).
                    
                    PROFILE STRENGTH should be calculated based on:
                    - Technical skill depth
                    - Experience quality
                    - Career progression
                    - Project complexity
                    - Education background
                    - Overall resume completeness
                    
                    REQUIRED JSON STRUCTURE:
                    
                    {
                      "name": "string",
                      "role": "string",
                      "location": "string",
                      "avatar": "string",
                      "totalExperience": "integer",
                      "availability": "string",
                      "expectedCTC": "string",
                      "summary": "string",
                      "skills": ["string"],
                      "education": [
                        {
                          "id": "string",
                          "degree": "string",
                          "institution": "string",
                          "period": "string"
                        }
                      ],
                      "certifications": [
                        {
                          "id": "string",
                          "name": "string",
                          "issuer": "string",
                          "date": "string"
                        }
                      ],
                      "experience": [
                        {
                          "id": "string",
                          "title": "string",
                          "company": "string",
                          "period": "string",
                          "description": ["string"]
                        }
                      ],
                      "matchPercentage": 0,
                      "aiInsights": ["string"],
                      "highestEducation": "string"
                    }
                    
                    IMPORTANT:
                    - education.period must be formatted like: "2016 — 2020"
                    - experience.period must be formatted like: "Jul 2022 — Present"
                    - Generate unique ids like: "edu1", "exp1", "cert1"
                    - avatar can be empty string if not available
                    
                    Resume Text:
                    """ + resumeText;

            String aiRawResponse = geminiService.generateContent(prompt);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(aiRawResponse);

            String aiText = root
                    .get("candidates")
                    .get(0)
                    .get("content")
                    .get("parts")
                    .get(0)
                    .get("text")
                    .asText();

            AIParsedProfileResponse parsed =
                    mapper.readValue(aiText, AIParsedProfileResponse.class);

            parsed.setResumeUrl(resumeUrl);

            return parsed;

        } catch (Exception e) {
            throw new RuntimeException("AI resume parsing failed", e);
        }
    }
}