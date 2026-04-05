package com.devstringx.AIHiringAssistance.modal.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationDTO {
    private String id;
    private String degree;
    private String institution;
    private String period;
}