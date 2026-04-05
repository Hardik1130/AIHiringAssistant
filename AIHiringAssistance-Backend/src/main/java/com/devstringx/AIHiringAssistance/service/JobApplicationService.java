package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.request.ApplicantFilterRequest;
import com.devstringx.AIHiringAssistance.modal.response.JobApplicantsResponseDTO;

public interface JobApplicationService {

    JobApplicantsResponseDTO getApplicantsByJobId(String jobId);

    JobApplicantsResponseDTO getFilteredApplicants(ApplicantFilterRequest filterRequest, int page, int size);
}
