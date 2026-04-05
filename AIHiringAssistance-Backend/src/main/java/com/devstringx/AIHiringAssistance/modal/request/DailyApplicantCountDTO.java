package com.devstringx.AIHiringAssistance.modal.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyApplicantCountDTO {

    private int day;       // day of month (1–31)
    private long count;    // number of applications on that day
}
