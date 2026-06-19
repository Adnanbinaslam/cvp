package com.adnan.communityvolunteer.services.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.adnan.communityvolunteer.dtos.LoginRequest;
import com.adnan.communityvolunteer.dtos.LoginResponse;
import com.adnan.communityvolunteer.dtos.RegisterRequest;
import com.adnan.communityvolunteer.dtos.UserResponse;
import com.adnan.communityvolunteer.entities.User;
import com.adnan.communityvolunteer.exceptions.EmailAlreadyExistsException;
import com.adnan.communityvolunteer.exceptions.InvalidCredentialsException;
import com.adnan.communityvolunteer.exceptions.ResourceNotFoundException;
import com.adnan.communityvolunteer.mappers.UserMapper;
import com.adnan.communityvolunteer.repositories.UserRepository;
import com.adnan.communityvolunteer.services.JwtService;
import com.adnan.communityvolunteer.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use");
        }
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId());
        return new LoginResponse(token, userMapper.toResponse(user));
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }
}
