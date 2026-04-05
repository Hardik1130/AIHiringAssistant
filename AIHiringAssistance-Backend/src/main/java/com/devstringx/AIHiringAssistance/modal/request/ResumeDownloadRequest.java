package com.devstringx.AIHiringAssistance.modal.request;


import lombok.Data;
import java.util.List;

@Data
public class ResumeDownloadRequest {

    private List<String> resumeUrls;

}
