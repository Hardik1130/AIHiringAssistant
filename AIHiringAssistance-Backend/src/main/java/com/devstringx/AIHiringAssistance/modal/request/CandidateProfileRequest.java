package com.devstringx.AIHiringAssistance.modal.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileRequest {

    @NotNull
    @Min(value = 0, message = "Experience cannot be negative")
    @Max(value = 40, message = "Experience looks invalid")
    private Integer totalExperience;

    @NotBlank(message = "Current role is required")
    @Size(min = 2, max = 100, message = "Current role length invalid")
    private String currentRole;

    private String certifications;

    private String availability;
    private String expectedCTC;
    private String summary;

//    private String resumeFilePath;
}

