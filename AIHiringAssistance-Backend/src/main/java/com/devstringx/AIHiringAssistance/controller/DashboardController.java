package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.modal.response.DashboardResponse;
import com.devstringx.AIHiringAssistance.modal.response.Response;
import com.devstringx.AIHiringAssistance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<Response> getAllDataforDashboard(){
        DashboardResponse dashboardResponse = dashboardService.getAllDataforDashboard();
        return ResponseEntity.ok(
            new Response(false, dashboardResponse ,
                    "Dashboard data fetched Successfully"));
    }

}
