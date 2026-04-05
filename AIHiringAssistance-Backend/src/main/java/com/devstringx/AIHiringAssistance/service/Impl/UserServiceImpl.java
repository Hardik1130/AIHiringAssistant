package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.AILayer.AvatarAIService;
import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import com.devstringx.AIHiringAssistance.modal.request.RegistrationRequest;
import com.devstringx.AIHiringAssistance.modal.response.CandidateListResponse;
import com.devstringx.AIHiringAssistance.modal.response.RegistrationResponse;
import com.devstringx.AIHiringAssistance.modal.response.Token;
import com.devstringx.AIHiringAssistance.repository.CandidateProfileRepository;
import com.devstringx.AIHiringAssistance.repository.UserRepository;
import com.devstringx.AIHiringAssistance.service.UserService;
import com.devstringx.AIHiringAssistance.util.JwtContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtContext jwtContext;
    private final CandidateProfileRepository candidateProfileRepository;
    private final AvatarAIService avatarAIService;

    @Override
    public RegistrationResponse createUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists with email: " + request.getEmail());
        }
        String generatedUserId = UUID.randomUUID().toString();

        // 1. Generate the AI Avatar before saving
        String aiGeneratedAvatar = avatarAIService.generateProfileAvatar(
                request.getFullName(),
                request.getUserType().name()
        );

        UserEntity user = UserEntity.builder()
                .userId(generatedUserId)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .userType(request.getUserType())
                .avatar(aiGeneratedAvatar)
                .active(true)
                .emailVerified(false)
                .build();
        UserEntity savedUser = userRepository.save(user);

        // 🔥 Create Candidate Profile Automatically
        CandidateProfile profile = CandidateProfile.builder()
                .userId(generatedUserId)   // same userId
                .avatar(aiGeneratedAvatar)
                .isSoftDelete(false)
                .build();
        candidateProfileRepository.save(profile);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                savedUser.getEmail(),
                savedUser.getPassword(),
                Collections.singleton(
                        new SimpleGrantedAuthority(savedUser.getUserType().name())
//                        new SimpleGrantedAuthority("ROLE_" + savedUser.getUserType().name())
                )
        );
        Token authenticatedtoken = jwtContext.getTokenObject(userDetails,savedUser.getUserId());
        return RegistrationResponse.builder()
                .userEntity(savedUser)
                .token(authenticatedtoken)
                .build();
    }

    @Override
    public Page<CandidateListResponse> getAllCandidates(Pageable pageable) {
        // 1. Fetch paginated profiles
        Page<CandidateProfile> profilePage = candidateProfileRepository.findAll(pageable);

        // 2. Extract all userIds from the current page
        List<String> userIds = profilePage.getContent().stream()
                .map(CandidateProfile::getUserId)
                .toList();

        // 3. Batch fetch users to get full names (Efficiency!)
        Map<String, UserEntity> userMap = userRepository.findByUserIdIn(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getUserId, user -> user));

        // 4. Map profiles to responses using the map
        List<CandidateListResponse> content = profilePage.getContent().stream().map(profile -> {
            UserEntity user = userMap.get(profile.getUserId());
            return CandidateListResponse.fromEntities(profile, user);
        }).collect(Collectors.toList());

        // 5. Return a new Page object
        return new PageImpl<>(content, pageable, profilePage.getTotalElements());
    }
}
