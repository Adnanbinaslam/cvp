package com.adnan.communityvolunteer.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adnan.communityvolunteer.dtos.ApiResponse;
import com.adnan.communityvolunteer.dtos.LoginRequest;
import com.adnan.communityvolunteer.dtos.LoginResponse;
import com.adnan.communityvolunteer.dtos.RegisterRequest;
import com.adnan.communityvolunteer.dtos.UserResponse;
import com.adnan.communityvolunteer.services.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Registration successful", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request,HttpServletResponse httpResponse) {
        LoginResponse response = userService.login(request);


        Cookie cookie = new Cookie("jwt", response.getToken());
        cookie.setHttpOnly(true); 
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        httpResponse.addCookie(cookie);

        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
    }

    // get current user info using userId from JWT (stored as String in request
    // attribute)
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(jakarta.servlet.http.HttpServletRequest request) {
        String userIdStr = (String) request.getAttribute("userId");
        if (userIdStr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Not authenticated", null));
        }
        // parse String → Long
        Long userId = Long.valueOf(userIdStr);
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "User fetched", user));
    }
}
