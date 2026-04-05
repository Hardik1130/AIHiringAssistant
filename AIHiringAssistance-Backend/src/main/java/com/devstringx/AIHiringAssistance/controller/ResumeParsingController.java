package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.modal.entity.ResumeParsingResult;
import com.devstringx.AIHiringAssistance.modal.response.Response;
import com.devstringx.AIHiringAssistance.service.ResumeParsingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class ResumeParsingController {

    private final ResumeParsingService resumeParsingService;

    @PostMapping("/parse-resume/{userId}")
    public ResponseEntity<Response> parseResume(@PathVariable String userId) {

        ResumeParsingResult result =
                resumeParsingService.parseResume(userId);

        return ResponseEntity.ok(
                new Response(false, result,
                        "Candidate profile saved successfully")
        );
    }
}
