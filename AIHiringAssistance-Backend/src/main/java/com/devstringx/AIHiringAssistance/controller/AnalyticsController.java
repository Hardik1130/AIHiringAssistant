package com.devstringx.AIHiringAssistance.controller;
import com.devstringx.AIHiringAssistance.modal.response.ApplicantFlowResponseDTO;
import com.devstringx.AIHiringAssistance.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/applicant-flow")
    public ResponseEntity<ApplicantFlowResponseDTO> getApplicantFlow(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        ApplicantFlowResponseDTO response = analyticsService.getApplicantFlow(month, year);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/applicants/today")
    public ResponseEntity<Map<String, Long>> getTodayApplicantCount() {
        long count = analyticsService.getTodayApplicantCount();
        return ResponseEntity.ok(Map.of("todayCount", count));
    }
}
