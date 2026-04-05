package com.devstringx.AIHiringAssistance.AILayer;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class AIClient {

    public Map<String, Object> parseResume(String resumeText) {

        // Later replace with real AI prompt
        Map<String, Object> response = new HashMap<>();

        response.put("skills", "Java, Spring Boot, Hibernate, MySQL");
        response.put("experience", "2+ years Backend Development");
        response.put("education", "B.Tech Computer Science");
        response.put("certifications", "Java & Spring Boot Certification");
        response.put("confidenceScore", 0.90);

        return response;
    }
}
