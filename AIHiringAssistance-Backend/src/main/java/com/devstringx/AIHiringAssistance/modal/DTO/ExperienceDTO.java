package com.devstringx.AIHiringAssistance.modal.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceDTO {
    private String id;
    private String title;
    private String company;
    private String period;
    private List<String> description;
}
