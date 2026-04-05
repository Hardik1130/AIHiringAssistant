package com.devstringx.AIHiringAssistance.modal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileUpdateResponse {
    private Integer totalExperience;
    private String currentRole;
    private String availability;
    private String expectedCTC;
    private String summary;
}
