package com.adnan.communityvolunteer.services;

import com.adnan.communityvolunteer.dtos.LoginRequest;
import com.adnan.communityvolunteer.dtos.LoginResponse;
import com.adnan.communityvolunteer.dtos.RegisterRequest;
import com.adnan.communityvolunteer.dtos.UserResponse;

public interface UserService {
    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    UserResponse getUserById(Long id);
}
