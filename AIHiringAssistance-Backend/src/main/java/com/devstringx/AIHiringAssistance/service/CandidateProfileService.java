package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.request.CandidateProfileRequest;
import com.devstringx.AIHiringAssistance.modal.response.CandidateProfileResponse;
import com.devstringx.AIHiringAssistance.modal.response.CandidateProfileUpdateResponse;

public interface CandidateProfileService {
    CandidateProfileUpdateResponse saveOrUpdateProfile(
            CandidateProfileRequest request
    );

    CandidateProfileResponse getProfile(String userId);
}

