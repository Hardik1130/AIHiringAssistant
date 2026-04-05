package com.devstringx.AIHiringAssistance.modal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Response {

    private Boolean error;
    private Object data;
    private String message;

}
