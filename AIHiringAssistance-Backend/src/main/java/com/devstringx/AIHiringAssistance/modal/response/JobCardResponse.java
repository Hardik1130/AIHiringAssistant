package com.devstringx.AIHiringAssistance.modal.response;

import com.devstringx.AIHiringAssistance.modal.entity.JobEntity;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobCardResponse {

    private JobEntity job;

    private long totalApplicants;

    private String posted;

    private Boolean hasApplied;
}