package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.common.annotation.CurrentUser;
import com.devstringx.AIHiringAssistance.modal.entity.JobEntity;
import com.devstringx.AIHiringAssistance.modal.request.CurrentUserDetails;
import com.devstringx.AIHiringAssistance.modal.request.JobAIGenerateRequest;
import com.devstringx.AIHiringAssistance.modal.response.Response;
import com.devstringx.AIHiringAssistance.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping("/ai-generate")
    public ResponseEntity<Response> generateAIDescription(
            @RequestBody JobAIGenerateRequest request,
            @CurrentUser CurrentUserDetails currentUser
            ) {
        JobEntity job = jobService.generateAIDescription(request, currentUser);
        return ResponseEntity.ok(new Response(false, job,"AI Job Description generated successfully"));
    }

    @PutMapping("/finalize")
    public ResponseEntity<Response> finalizeJob(
            @RequestParam String jobId,
            @CurrentUser CurrentUserDetails currentUser
    ) {
        JobEntity job = jobService.finalizeJob(jobId, currentUser);
        var data = Map.of(
                "jobId", job.getJobId(),
                "finalized", job.isFinalized()
        );
        return ResponseEntity.ok(
                Response.builder()
                        .error(false)
                        .data(data)
                        .message("Job Description finalized successfully")
                        .build()
        );
    }

    @PostMapping("/apply")
    public ResponseEntity<Response> applyForJob(
            @RequestParam String jobId,
            @CurrentUser CurrentUserDetails currentUser
    ) {
        Map<String, Object> data = jobService.applyForJob(jobId, currentUser);
        //If Profile is made then only user can apply for a job--------------
        return ResponseEntity.ok(
                Response.builder()
                        .error(false)
                        .data(data)
                        .message("Job applied successfully")
                        .build()
        );
    }


    @GetMapping
    public ResponseEntity<Response> getAllFinalizedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        int pageNumber = page-1;
        var jobsPage = jobService.getAllFinalizedJobs(pageNumber, size);
        var data = Map.of(
                "jobs", jobsPage.getContent(),
                "currentPage", jobsPage.getNumber(),
                "totalPages", jobsPage.getTotalPages(),
                "totalJobs", jobsPage.getTotalElements()
        );

        return ResponseEntity.ok(
                Response.builder()
                        .error(false)
                        .data(data)
                        .message("Finalized jobs fetched successfully")
                        .build()
        );
    }
}
