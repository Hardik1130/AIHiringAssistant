package com.devstringx.AIHiringAssistance.exception;

import com.devstringx.AIHiringAssistance.modal.response.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<Response> buildResponse(HttpStatus status, String message) {
        Response response = Response.builder()
                .error(status.isError())   // 4xx / 5xx → true
                .message(message)
                .data(null)
                .build();
        return new ResponseEntity<>(response, status);
    }
}
