package com.devstringx.AIHiringAssistance.service;

import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import com.devstringx.AIHiringAssistance.modal.request.LoginRequest;
import com.devstringx.AIHiringAssistance.modal.response.LoginResponse;
import com.devstringx.AIHiringAssistance.repository.UserRepository;
import com.devstringx.AIHiringAssistance.util.JwtContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserVerifyService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtContext jwtContext;
    private final AppUserDetailService appUserDetailService;

    public LoginResponse verify(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        if (!authentication.isAuthenticated()) {
            throw new BadCredentialsException("Invalid email or password");
        }

        UserEntity userEntity = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserDetails userDetails =
                appUserDetailService.loadUserByUsername(loginRequest.getEmail());

        return LoginResponse.builder()
                .userEntity(userEntity)
                .token(jwtContext.getTokenObject(userDetails, userEntity.getUserId()))
                .build();
    }
}