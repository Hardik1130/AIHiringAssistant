package com.devstringx.AIHiringAssistance.modal.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    // Option 1: Email + Password
    private String email;
    private String password;

    // Option 2: Phone based login
    private String phone;
}
