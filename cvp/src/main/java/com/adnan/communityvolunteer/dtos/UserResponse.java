package com.adnan.communityvolunteer.dtos;

import java.time.LocalDateTime;

import com.adnan.communityvolunteer.enums.Role;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String mobileNumber;
    private LocalDateTime createdAt; 
    private Role role;
}
