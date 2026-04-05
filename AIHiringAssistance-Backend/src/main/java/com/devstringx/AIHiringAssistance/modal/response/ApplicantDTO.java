package com.devstringx.AIHiringAssistance.modal.response;

import com.devstringx.AIHiringAssistance.modal.entity.Education;
import lombok.*;

import java.util.List;

@Data
@Builder
public class ApplicantDTO {
    private String userId;
    private String applicationId;
    private String fullname;           // To be fetched from UserEntity
    private String currentRole;    // e.g., "Senior AI Researcher"
    private String location;
    private Integer totalExperience;
    private Double aiScore;        // Corresponds to "Role Fit" in your UI
    private String topSkills;
    private String education;// e.g., "INTERVIEWING", "APPLIED"
    private String resumeUrl;
    private String avatar;
    private String email;
}
