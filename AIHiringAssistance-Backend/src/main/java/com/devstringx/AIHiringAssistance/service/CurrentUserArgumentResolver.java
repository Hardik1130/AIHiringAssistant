package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.common.annotation.CurrentUser;
import com.devstringx.AIHiringAssistance.enums.UserType;
import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import com.devstringx.AIHiringAssistance.modal.request.CurrentUserDetails;
import com.devstringx.AIHiringAssistance.repository.UserRepository;
import com.devstringx.AIHiringAssistance.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class) &&
                parameter.getParameterType().equals(CurrentUserDetails.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {

        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);

        // 1️⃣ Extract JWT token from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null; // or throw exception if token is mandatory
        }

        String token = authHeader.substring(7); // Remove "Bearer "

        // 2️⃣ Extract user info from token using JwtUtil
        String userId = jwtUtil.extractUserId(token);
        String username = jwtUtil.extractUsername(token);
        UserType userType = jwtUtil.extractUserType(token);
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));


        // 3️⃣ Build CurrentUserDetails object
        return CurrentUserDetails.builder()
                .userEntity(userEntity)
                .userId(userId)
                .fullName(username)
                .userType(userType)
                .build();
    }
}

