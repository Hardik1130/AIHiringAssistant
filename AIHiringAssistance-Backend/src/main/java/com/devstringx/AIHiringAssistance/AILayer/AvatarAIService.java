package com.devstringx.AIHiringAssistance.AILayer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class AvatarAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateProfileAvatar(String fullName, String userType) {
        // Construct a professional prompt based on user details
        String prompt = String.format(
                "A professional, high-quality 3D minimalist avatar icon of a %s candidate named %s. " +
                        "Modern corporate style, soft lighting, solid neutral background, centered, professional attire.",
                userType, fullName
        );

        // Prepare the Request Body for Gemini 2.5 Flash
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "response_modalities", List.of("IMAGE"), // Crucial for 2.5 Flash
                        "temperature", 0.4
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

            // Navigate the JSON response: candidates[0].content.parts[0].inlineData.data
            List<Map> candidates = (List<Map>) response.getBody().get("candidates");
            Map content = (Map) candidates.get(0).get("content");
            List<Map> parts = (List<Map>) content.get("parts");
            Map inlineData = (Map) parts.get(0).get("inlineData");

            String base64Image = (String) inlineData.get("data");

            // Return as a Data URI so the frontend can display it immediately
            return "data:image/png;base64," + base64Image;

        } catch (Exception e) {
            // Fallback to a default placeholder if AI fails
            return "https://api.dicebear.com/9.x/avataaars/svg?seed=" + fullName.replace(" ", "");
        }
    }
}