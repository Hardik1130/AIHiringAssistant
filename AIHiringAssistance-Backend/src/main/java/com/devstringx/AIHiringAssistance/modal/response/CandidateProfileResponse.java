package com.devstringx.AIHiringAssistance.modal.response;

import com.devstringx.AIHiringAssistance.modal.DTO.CertificationDTO;
import com.devstringx.AIHiringAssistance.modal.DTO.EducationDTO;
import com.devstringx.AIHiringAssistance.modal.DTO.ExperienceDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileResponse {

    private String name;
    private String role;
    private String location;
    private String avatar;
    private String totalExperience;
    private String availability;
    private String expectedCTC;
    private String summary;
    private List<String> skills;
    private List<EducationDTO> education;
    private List<CertificationDTO> certifications;
    private List<ExperienceDTO> experience;
    private Integer matchPercentage;
    private List<String> aiInsights;
    private String highestEducation;
    private String resumeUrl;

}
