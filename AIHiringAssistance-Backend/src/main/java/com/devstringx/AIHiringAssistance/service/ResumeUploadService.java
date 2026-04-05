package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.response.AIParsedProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeUploadService {

    AIParsedProfileResponse uploadResume(MultipartFile file);
}

