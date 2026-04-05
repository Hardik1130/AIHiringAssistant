package com.devstringx.AIHiringAssistance.modal.response;
//
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIGeneratedJDResponse {

    private String jobSummary;
    private List<String> responsibilities;
    private List<String> qualifications;
}
