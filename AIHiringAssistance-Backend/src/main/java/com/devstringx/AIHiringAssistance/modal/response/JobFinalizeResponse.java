package com.devstringx.AIHiringAssistance.modal.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JobFinalizeResponse {
    private String jobId;
    private boolean finalized;
    private String message;
}

