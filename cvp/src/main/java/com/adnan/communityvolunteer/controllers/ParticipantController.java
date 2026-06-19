

package com.adnan.communityvolunteer.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.adnan.communityvolunteer.dtos.ApiResponse;
import com.adnan.communityvolunteer.dtos.ParticipantResponse;
import com.adnan.communityvolunteer.exceptions.UnauthorizedException;
import com.adnan.communityvolunteer.services.EmailService;
import com.adnan.communityvolunteer.services.ParticipantService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/participants")
@RequiredArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;
    private final EmailService emailService;

    private Long extractUserId(HttpServletRequest request) {
        String userIdStr = (String) request.getAttribute("userId");
        if (userIdStr == null)
            throw new UnauthorizedException("Not authenticated");
        return Long.valueOf(userIdStr);
    }

    @PostMapping("/signup/{taskId}")
    public ResponseEntity<ApiResponse<ParticipantResponse>> signup(
            @PathVariable String taskId,
            HttpServletRequest request) {
        Long userId = extractUserId(request);
        Long tId = Long.valueOf(taskId);
        ParticipantResponse response = participantService.signup(tId, userId);

        // send confirmation email
        emailService.sendSignupConfirmation(
                response.getUserEmail(),
                response.getTaskTitle());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Signed up successfully", response));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<ApiResponse<List<ParticipantResponse>>> getByTask(@PathVariable String taskId) {
        Long tId = Long.valueOf(taskId);
        List<ParticipantResponse> list = participantService.getParticipantsByTask(tId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Participants fetched", list));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ParticipantResponse>>> getMySignups(HttpServletRequest request) {
        Long userId = extractUserId(request);
        List<ParticipantResponse> list = participantService.getTasksSignedUpByUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Your signups fetched", list));
    }

    @PutMapping("/{participantId}/status")
    public ResponseEntity<ApiResponse<ParticipantResponse>> updateStatus(
            @PathVariable String participantId,
            @RequestParam String status,
            HttpServletRequest request) {
        Long userId = extractUserId(request);
        Long pId = Long.valueOf(participantId);
        ParticipantResponse response = participantService.updateStatus(pId, status, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Status updated", response));
    }

    @DeleteMapping("/withdraw/{taskId}")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @PathVariable String taskId,
            HttpServletRequest request) {
        Long userId = extractUserId(request);
        Long tId = Long.valueOf(taskId);
        participantService.withdraw(tId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Withdrawn successfully", null));
    }
}