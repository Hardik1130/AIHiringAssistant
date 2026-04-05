package com.devstringx.AIHiringAssistance.modal.response;

import com.devstringx.AIHiringAssistance.enums.UserType;
import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private UserEntity userEntity;
    private Token token;
}
