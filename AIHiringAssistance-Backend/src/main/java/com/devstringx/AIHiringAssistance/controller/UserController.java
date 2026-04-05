package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.modal.response.CandidateListResponse;
import com.devstringx.AIHiringAssistance.modal.response.DashboardResponse;
import com.devstringx.AIHiringAssistance.modal.response.Response;
import com.devstringx.AIHiringAssistance.service.DashboardService;
import com.devstringx.AIHiringAssistance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<Response> getCandidateList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        int pageNumber = page-1;
        Pageable pageable = PageRequest.of(pageNumber, size);
        Page<CandidateListResponse> candidates = userService.getAllCandidates(pageable);

        return ResponseEntity.ok(
                Response.builder()
                        .error(false)
                        .data(candidates)
                        .message("Users fetched successfully")
                        .build()
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Response> getAllDataforDashboard(){
        DashboardResponse dashboardResponse = dashboardService.getAllDataforDashboard();
        return ResponseEntity.ok(
                new Response(false, dashboardResponse ,
                        "Dashboard data fetched Successfully"));
    }
}
