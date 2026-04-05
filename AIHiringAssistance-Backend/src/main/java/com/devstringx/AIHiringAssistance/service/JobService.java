package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.entity.JobEntity;
import com.devstringx.AIHiringAssistance.modal.request.CurrentUserDetails;
import com.devstringx.AIHiringAssistance.modal.request.JobAIGenerateRequest;
import com.devstringx.AIHiringAssistance.modal.response.JobCardResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface JobService {

    JobEntity generateAIDescription(JobAIGenerateRequest request, CurrentUserDetails currentUser);
    JobEntity finalizeJob(String jobId, CurrentUserDetails currentUser);

    Map<String, Object> applyForJob(String jobId, CurrentUserDetails currentUser);

    Page<JobCardResponse> getAllFinalizedJobs(int page, int size);
}
