package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.common.annotation.CurrentUser;
import com.devstringx.AIHiringAssistance.modal.entity.CandidateProfile;
import com.devstringx.AIHiringAssistance.modal.request.CurrentUserDetails;
import com.devstringx.AIHiringAssistance.modal.response.AIParsedProfileResponse;
import com.devstringx.AIHiringAssistance.modal.response.Response;
import com.devstringx.AIHiringAssistance.repository.CandidateProfileRepository;
import com.devstringx.AIHiringAssistance.service.ResumeUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URL;
import java.util.Base64;
import java.util.Map;

@Controller
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class ResumeUploadController {

    private final ResumeUploadService resumeUploadService;
    private final CandidateProfileRepository candidateProfileRepository;

    @PostMapping("/upload-resume")
    public ResponseEntity<Response> uploadResume(
            @RequestParam("file") MultipartFile file
    ) {
        AIParsedProfileResponse aiProfile =
                resumeUploadService.uploadResume(file);

        return ResponseEntity.ok(
                Response.builder()
                        .error(false)
                        .message("Resume parsed successfully")
                        .data(aiProfile)
                        .build());
    }

    @GetMapping("/download-resume")
    public ResponseEntity<Response> downloadResume(
            @CurrentUser CurrentUserDetails currentUser
    ) {

        try {

            String userId = currentUser.getUserId();

            CandidateProfile profile = candidateProfileRepository
                    .findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            String fileUrl = profile.getResumeFilePath();

            if (fileUrl == null || fileUrl.isEmpty()) {
                return ResponseEntity.ok(
                        Response.builder()
                                .error(true)
                                .message("Resume not uploaded")
                                .data(null)
                                .build()
                );
            }

            // Return direct file URL
            return ResponseEntity.ok(
                    Response.builder()
                            .error(false)
                            .message("Resume download link generated")
                            .data(fileUrl)   // <-- Direct file URL here
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.ok(
                    Response.builder()
                            .error(true)
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }
}

