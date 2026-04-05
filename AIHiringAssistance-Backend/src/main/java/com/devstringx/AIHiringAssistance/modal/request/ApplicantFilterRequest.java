package com.devstringx.AIHiringAssistance.modal.request;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantFilterRequest {
    private String jobId;
    private List<String> scoreRanges; // ["High (90%+)", "Medium (70-90%)", "Low (< 70%)"]
    private List<String> topSkills;   // ["Python", "PyTorch"]
    private Integer experience;       // Value from the slider (e.g., 5)
    private String educationLevel;    // "PhD Candidates" or "Masters Degree"
}