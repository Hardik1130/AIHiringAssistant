package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import com.devstringx.AIHiringAssistance.modal.request.RegistrationRequest;
import com.devstringx.AIHiringAssistance.modal.response.CandidateListResponse;
import com.devstringx.AIHiringAssistance.modal.response.RegistrationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    RegistrationResponse createUser(RegistrationRequest user);

    Page<CandidateListResponse> getAllCandidates(Pageable pageable);
}
