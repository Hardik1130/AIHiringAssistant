package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.response.ApplicantFlowResponseDTO;

public interface AnalyticsService {

    /**
     * Returns today's applicant count + full daily flow for the given month/year.
     * If month/year are null, defaults to current month/year.
     */
    ApplicantFlowResponseDTO getApplicantFlow(Integer month, Integer year);

    /**
     * Returns only the count of candidates who applied today.
     */
    long getTodayApplicantCount();
}
