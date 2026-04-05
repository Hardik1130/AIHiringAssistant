package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.response.AIParsedProfileResponse;

public interface AIProfileParserService {

    AIParsedProfileResponse parseResume(String resumeText, String resumeUrl);

}