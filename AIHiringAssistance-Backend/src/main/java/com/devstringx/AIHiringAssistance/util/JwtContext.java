package com.devstringx.AIHiringAssistance.util;

import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import com.devstringx.AIHiringAssistance.modal.response.Token;
import com.devstringx.AIHiringAssistance.repository.UserRepository;
import lombok.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@Data
@RequiredArgsConstructor
@Builder
public class JwtContext {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public Token getTokenObject(UserDetails userDetails,String userId)
    {
        UserEntity user = userRepository.findByUserId(userId).orElseThrow(()->new RuntimeException("User not Found!!!"));
        Token token = Token.builder()
                .accessToken(jwtUtil.generateToken(userDetails, user.getUserId(),user.getUserType()))
                .refreshToken(jwtUtil.generateRefreshToken(userDetails, user.getUserId(),user.getUserType()))
                .build();
        return token;
    }

}
