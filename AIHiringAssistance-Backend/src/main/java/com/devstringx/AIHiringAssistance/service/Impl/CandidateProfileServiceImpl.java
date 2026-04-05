package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import com.devstringx.AIHiringAssistance.modal.mapper.CandidateMapper;
import com.devstringx.AIHiringAssistance.modal.mapper.CandidateProfileUpdateMapper;
import com.devstringx.AIHiringAssistance.modal.request.CandidateProfileRequest;
import com.devstringx.AIHiringAssistance.modal.response.CandidateProfileResponse;
import com.devstringx.AIHiringAssistance.modal.response.CandidateProfileUpdateResponse;
import com.devstringx.AIHiringAssistance.repository.CandidateProfileRepository;
import com.devstringx.AIHiringAssistance.repository.UserRepository;
import com.devstringx.AIHiringAssistance.service.CandidateProfileService;
import com.devstringx.AIHiringAssistance.util.LoggedInUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateProfileServiceImpl implements CandidateProfileService {

    private final CandidateProfileRepository repository;
    private final LoggedInUserContext userContext;
    private final UserRepository userRepository;
    private final CandidateMapper candidateMapper;

    @Override
    public CandidateProfileUpdateResponse saveOrUpdateProfile(
            CandidateProfileRequest request
    ) {
        String userId = userContext.getUserId();
        CandidateProfile profile = repository
                .findByUserIdAndIsSoftDeleteFalse(userId)
                        .orElseThrow(()->new RuntimeException("User not Found"));
        profile.setUserId(userId);
        profile.setTotalExperience(request.getTotalExperience());
        profile.setCurrentRole(request.getCurrentRole());
        profile.setAvailability(request.getAvailability());
        profile.setExpectedCTC(request.getExpectedCTC());
        profile.setSummary(request.getSummary());
        CandidateProfile savedProfile = repository.save(profile);
        return CandidateProfileUpdateMapper.toResponse(savedProfile);
    }

    @Override
    public CandidateProfileResponse getProfile(String userId) {
        CandidateProfile profile = repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for this ID"));

        String fullName = userRepository.findByUserId(userId)
                .map(UserEntity::getFullName)
                .orElse("");

        return candidateMapper.toResponse(profile, fullName);
    }

}

