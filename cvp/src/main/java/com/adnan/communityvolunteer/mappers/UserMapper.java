package com.adnan.communityvolunteer.mappers;

import org.springframework.stereotype.Component;

import com.adnan.communityvolunteer.dtos.RegisterRequest;
import com.adnan.communityvolunteer.dtos.UserResponse;
import com.adnan.communityvolunteer.entities.User;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setMobileNumber(request.getMobileNumber());
        return user;
    }

    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setMobileNumber(user.getMobileNumber());
        response.setCreatedAt(user.getCreatedAt());
        response.setRole(user.getRole());
        return response;
    }
}
