package com.devstringx.AIHiringAssistance.AILayer;

import com.devstringx.AIHiringAssistance.modal.response.AIGeneratedJDResponse;
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
public class AIJDGenerator {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // 🟢 ADDED
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // 🟢 ADDED
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    
    public AIGeneratedJDResponse generateStructuredJD(String prompt) {

        try {
            // ================================
            // 1️⃣ GEMINI REQUEST BODY
            // ================================
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "role", "user",
                                    "parts", List.of(
                                            Map.of(
                                                    "text",
                                                    """
                                                    Return ONLY valid JSON.
                                                    No markdown.
                                                    No explanation.
                                                    %s
                                                    """.formatted(prompt)
                                            )
                                    )
                            )
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.3
                    )
            );

            // ================================
            // 2️⃣ HEADERS
            // ================================
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(requestBody, headers);

            // ================================
            // 3️⃣ API CALL (GEMINI)
            // ================================
            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            geminiApiUrl + "?key=" + geminiApiKey,
                            request,
                            String.class
                    );

            System.out.println("RAW GEMINI RESPONSE = " + response.getBody());

            // ================================
            // 4️⃣ EXTRACT AI CONTENT
            // ================================
            String aiText = extractGeminiText(response.getBody());

            // ================================
            // 5️⃣ MAP JSON → JAVA OBJECT
            // ================================
            return objectMapper.readValue(aiText, AIGeneratedJDResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("Gemini AI JD generation failed", e);
        }
    }


    // ================================
    // 🔽 GEMINI RESPONSE PARSER
    // ================================
    private String extractGeminiText(String body) throws Exception {

        JsonNode root = objectMapper.readTree(body);

        JsonNode textNode = root
                .get("candidates")
                .get(0)
                .get("content")
                .get("parts")
                .get(0)
                .get("text");

        if (textNode == null || textNode.isNull()) {
            throw new RuntimeException("Empty Gemini response");
        }

        return textNode.asText();
    }
}
