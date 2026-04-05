package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.modal.request.ResumeDownloadRequest;
import com.devstringx.AIHiringAssistance.service.Impl.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/download-all-resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<byte[]> downloadAllResumes(
            @RequestBody ResumeDownloadRequest request) throws IOException {

        byte[] zipFile = resumeService.downloadResumes(request.getResumeUrls());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resumes.zip")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(zipFile);
    }
}
