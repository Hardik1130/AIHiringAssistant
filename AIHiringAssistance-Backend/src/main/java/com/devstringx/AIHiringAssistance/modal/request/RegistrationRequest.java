package com.devstringx.AIHiringAssistance.modal.request;

import com.devstringx.AIHiringAssistance.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private UserType userType;
}

