package com.adnan.communityvolunteer.services;

import java.util.List;

import com.adnan.communityvolunteer.dtos.ParticipantResponse;

public interface ParticipantService {
    ParticipantResponse signup(Long taskId, Long userId);
    List<ParticipantResponse> getParticipantsByTask(Long taskId);
    List<ParticipantResponse> getTasksSignedUpByUser(Long userId);
    ParticipantResponse updateStatus(Long participantId, String status, Long userId);
    void withdraw(Long taskId, Long userId);
}
