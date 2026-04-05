package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.common.annotation.CurrentUser;
import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.request.CandidateProfileRequest;
import com.devstringx.AIHiringAssistance.modal.request.CurrentUserDetails;
import com.devstringx.AIHiringAssistance.modal.response.CandidateProfileResponse;
import com.devstringx.AIHiringAssistance.modal.response.CandidateProfileUpdateResponse;
import com.devstringx.AIHiringAssistance.modal.response.Response;
import com.devstringx.AIHiringAssistance.service.CandidateProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService profileService;

    @PostMapping
    public ResponseEntity<Response> addOrUpdateProfile(
            @Valid @RequestBody CandidateProfileRequest request
    ) {
        CandidateProfileUpdateResponse profile =
                profileService.saveOrUpdateProfile(request);

        return ResponseEntity.ok(
                new Response(false, profile,
                        "Candidate profile saved successfully")
        );
    }

    @GetMapping
    public ResponseEntity<Response> getProfile(
            @CurrentUser CurrentUserDetails currentUser,
            @RequestParam(required = false) String userId // Optional parameter
    ) {
        // If userId param is present, use it; otherwise, use logged-in user's ID
        String targetUserId = (userId != null && !userId.isBlank())
                ? userId
                : currentUser.getUserId();

        CandidateProfileResponse profile = profileService.getProfile(targetUserId);

        return ResponseEntity.ok(
                Response.builder()
                        .error(false)
                        .data(profile)
                        .message("Profile Fetched Successfully")
                        .build()
        );
    }

}

