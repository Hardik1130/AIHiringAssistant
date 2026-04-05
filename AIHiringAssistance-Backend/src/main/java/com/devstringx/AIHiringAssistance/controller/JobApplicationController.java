package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.modal.request.ApplicantFilterRequest;
import com.devstringx.AIHiringAssistance.modal.response.JobApplicantsResponseDTO;
import com.devstringx.AIHiringAssistance.modal.response.Response;
import com.devstringx.AIHiringAssistance.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applicants")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<Response> getFilteredApplicants(
            @RequestBody ApplicantFilterRequest filterRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        JobApplicantsResponseDTO response = jobApplicationService.getFilteredApplicants(filterRequest,page,size);
        return ResponseEntity.ok(new Response(false, response,"Getting Filtered Students"));
    }
}