package com.devstringx.AIHiringAssistance.util;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoggedInUserContext {

    private final JwtUtil jwtUtil;

    private final HttpServletRequest request;

    public String getUserId() {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }

        String token = authHeader.substring(7);

        return jwtUtil.extractUserId(token);
    }
}


