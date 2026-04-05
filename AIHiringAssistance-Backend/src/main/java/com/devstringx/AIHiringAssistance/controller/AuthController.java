package com.devstringx.AIHiringAssistance.controller;

import com.devstringx.AIHiringAssistance.modal.request.LoginRequest;
import com.devstringx.AIHiringAssistance.modal.request.RegistrationRequest;
import com.devstringx.AIHiringAssistance.modal.response.LoginResponse;
import com.devstringx.AIHiringAssistance.modal.response.RegistrationResponse;
import com.devstringx.AIHiringAssistance.service.UserService;
import com.devstringx.AIHiringAssistance.service.UserVerifyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@Controller
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final UserVerifyService userVerifyService;

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> createUser(@RequestBody RegistrationRequest user) {
        log.info("Register request for email: {}", user.getEmail());
        RegistrationResponse userResponse = userService.createUser(user);
        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = userVerifyService.verify(loginRequest);
            return ResponseEntity.ok(loginResponse);

        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");

        } catch (UsernameNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong");
        }
    }

}

