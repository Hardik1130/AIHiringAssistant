package com.devstringx.AIHiringAssistance.modal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AIScoreResponse {

    private Double skillMatchScore;
    private Double experienceMatchScore;
    private Double educationMatchScore;
    private Double overallScore;

    private String explanation;
}
