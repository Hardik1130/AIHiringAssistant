package com.devstringx.AIHiringAssistance.modal.request;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class JobAIGenerateRequest {

    private String title;
    private String department;

    private Integer minExperience;
    private Integer maxExperience;

    private String employmentType;
    private String location;

    private List<String> skillsRequired;
}
