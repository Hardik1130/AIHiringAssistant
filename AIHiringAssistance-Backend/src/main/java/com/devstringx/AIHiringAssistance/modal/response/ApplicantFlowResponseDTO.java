package com.devstringx.AIHiringAssistance.modal.response;

import com.devstringx.AIHiringAssistance.modal.request.DailyApplicantCountDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantFlowResponseDTO {

    private int month;                              // e.g. 3 for March
    private int year;                               // e.g. 2026
    private long todayCount;                        // applicants submitted today
    private long monthTotalCount;                   // total for the month
    private List<DailyApplicantCountDTO> dailyFlow; // list of {day, count} for chart
}
