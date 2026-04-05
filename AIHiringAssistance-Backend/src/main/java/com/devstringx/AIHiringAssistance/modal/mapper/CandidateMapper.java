package com.devstringx.AIHiringAssistance.modal.mapper;

import com.devstringx.AIHiringAssistance.modal.DTO.CertificationDTO;
import com.devstringx.AIHiringAssistance.modal.DTO.EducationDTO;
import com.devstringx.AIHiringAssistance.modal.DTO.ExperienceDTO;
import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.entity.Certification;
import com.devstringx.AIHiringAssistance.modal.entity.Education;
import com.devstringx.AIHiringAssistance.modal.entity.Experience;
import com.devstringx.AIHiringAssistance.modal.response.CandidateProfileResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Builder
@Data
public class CandidateMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public CandidateProfileResponse toResponse(
            CandidateProfile profile,
            String fullName
    ) {

        return CandidateProfileResponse.builder()
                .name(fullName)
                .role(profile.getCurrentRole())
                .location(profile.getLocation())
                .avatar(profile.getAvatar())
                .totalExperience(
                        profile.getTotalExperience() != null
                                ? profile.getTotalExperience() + ""
                                : ""
                )
                .availability(profile.getAvailability())
                .expectedCTC(profile.getExpectedCTC())
                .summary(profile.getSummary())
                .skills(parseSkills(profile.getSkills()))
                .education(mapEducation(profile.getEducation()))
                .certifications(mapCertifications(profile.getCertifications()))
                .experience(mapExperience(profile.getExperience()))
                .matchPercentage(profile.getMatchPercentage())
                .aiInsights(profile.getAiInsights())
                .highestEducation(profile.getHighestEducation())
                .resumeUrl(profile.getResumeFilePath())
                .build();
    }

    private List<String> parseSkills(String skills) {

        if (skills == null || skills.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(
                    skills,
                    new TypeReference<List<String>>() {}
            );
        } catch (Exception e) {
            return List.of(); // or log error
        }
    }

    private List<EducationDTO> mapEducation(List<Education> educationList) {

        if (educationList == null) return List.of();

        return educationList.stream()
                .map(edu -> EducationDTO.builder()
                        .id(String.valueOf(edu.getId()))
                        .degree(edu.getDegree())
                        .institution(edu.getInstitution())
                        .period(edu.getPeriod())
                        .build())
                .toList();
    }

    private List<CertificationDTO> mapCertifications(List<Certification> list) {

        if (list == null) return List.of();

        return list.stream()
                .map(cert -> CertificationDTO.builder()
                        .id(String.valueOf(cert.getId()))
                        .name(cert.getName())
                        .issuer(cert.getIssuer())
                        .date(cert.getDate())
                        .build())
                .toList();
    }

    private List<ExperienceDTO> mapExperience(List<Experience> list) {

        if (list == null) return List.of();

        return list.stream()
                .map(exp -> ExperienceDTO.builder()
                        .id(String.valueOf(exp.getId()))
                        .title(exp.getTitle())
                        .company(exp.getCompany())
                        .period(exp.getPeriod())
                        .description(exp.getDescription())
                        .build())
                .toList();
    }

}
