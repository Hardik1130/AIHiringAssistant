package com.devstringx.AIHiringAssistance.modal.mapper;

import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.response.CandidateProfileUpdateResponse;

public class CandidateProfileUpdateMapper {

    private CandidateProfileUpdateMapper() {
        // Prevent instantiation
    }

    public static CandidateProfileUpdateResponse toResponse(CandidateProfile profile) {

        if (profile == null) {
            return null;
        }

        return CandidateProfileUpdateResponse.builder()
                .totalExperience(profile.getTotalExperience())
                .currentRole(profile.getCurrentRole())
                .availability(profile.getAvailability())
                .expectedCTC(profile.getExpectedCTC())
                .summary(profile.getSummary())
                .build();
    }
}