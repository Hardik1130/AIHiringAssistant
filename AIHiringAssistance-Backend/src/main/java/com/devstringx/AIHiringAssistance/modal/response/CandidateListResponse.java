package com.devstringx.AIHiringAssistance.modal.response;

import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CandidateListResponse {

    private String userId;

    private String avatar;

    private Integer matchPercentage;

    private String fullName;

    private String currentRole;

    private String location;

    private Integer experience;

    private String skills;

    private String email;

    public static CandidateListResponse fromEntities(CandidateProfile profile, UserEntity user) {
        if (profile == null || user == null) {
            return null;
        }

        return CandidateListResponse.builder()
                .userId(profile.getUserId())
                .avatar(profile.getAvatar())
                .matchPercentage(profile.getMatchPercentage())
                .fullName(user.getFullName()) // Mapping from UserEntity
                .currentRole(profile.getCurrentRole())
                .location(profile.getLocation())
                .experience(profile.getTotalExperience()) // Mapping from totalExperience
                .skills(profile.getSkills())
                .email(user.getEmail())
                .build();
    }
}