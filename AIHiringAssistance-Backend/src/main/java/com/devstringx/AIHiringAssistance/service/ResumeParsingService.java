package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.entity.ResumeParsingResult;

public interface ResumeParsingService {

    ResumeParsingResult parseResume(String userId);
}
