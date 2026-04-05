package com.devstringx.AIHiringAssistance.modal.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicantsResponseDTO {
    private JobSummaryDTO jobDetails;
    private List<ApplicantDTO> applicants;
    private Long totalApplicants;
    // Pagination Metadata
//    private long totalElements;  // Total filtered applicants
    private int totalPages;      // Total pages based on size
    private int currentPage;     // The page user is currently on
    private int pageSize;        // The size (e.g., 10)
    private boolean isLast;
}