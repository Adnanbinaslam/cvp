package com.adnan.communityvolunteer.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.adnan.communityvolunteer.dtos.ApiResponse;
import com.adnan.communityvolunteer.dtos.UserResponse;
import com.adnan.communityvolunteer.entities.User;
import com.adnan.communityvolunteer.enums.ParticipationStatus;
import com.adnan.communityvolunteer.enums.Role;
import com.adnan.communityvolunteer.enums.TaskStatus;
import com.adnan.communityvolunteer.repositories.TaskParticipantRepository;
import com.adnan.communityvolunteer.repositories.TaskRepository;
import com.adnan.communityvolunteer.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskParticipantRepository participantRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.countByRole(Role.USER));
        stats.put("completedTasks", (long) participantRepository.countByStatus(ParticipationStatus.COMPLETED));
        stats.put("openTasks", taskRepository.countByStatus(TaskStatus.OPEN));
        stats.put("totalImpactHours", participantRepository.sumCompletedTaskDurations());
        return ResponseEntity.ok(new ApiResponse<>(true, "Stats fetched", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getVolunteers() {
        List<User> users = userRepository.findByRole(Role.USER);
        List<UserResponse> responses = users.stream()
                .map(u -> {
                    UserResponse r = new UserResponse();
                    r.setId(u.getId());
                    r.setName(u.getName());
                    r.setEmail(u.getEmail());
                    r.setRole(u.getRole());
                    return r;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Users fetched", responses));
    }
}