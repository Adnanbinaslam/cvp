package com.adnan.communityvolunteer.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.adnan.communityvolunteer.dtos.ParticipantResponse;
import com.adnan.communityvolunteer.entities.Task;
import com.adnan.communityvolunteer.entities.TaskParticipant;
import com.adnan.communityvolunteer.entities.User;
import com.adnan.communityvolunteer.enums.ParticipationStatus;
import com.adnan.communityvolunteer.enums.TaskStatus;
import com.adnan.communityvolunteer.exceptions.ResourceNotFoundException;
import com.adnan.communityvolunteer.exceptions.UnauthorizedException;
import com.adnan.communityvolunteer.mappers.ParticipantMapper;
import com.adnan.communityvolunteer.repositories.TaskParticipantRepository;
import com.adnan.communityvolunteer.repositories.TaskRepository;
import com.adnan.communityvolunteer.repositories.UserRepository;
import com.adnan.communityvolunteer.services.ParticipantService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParticipantServiceImpl implements ParticipantService {

    private final TaskParticipantRepository participantRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ParticipantMapper participantMapper;

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private Task getTask(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    @Override
    public ParticipantResponse signup(Long taskId, Long userId) {
        Task task = getTask(taskId);
        User user = getUser(userId);

        // only OPEN tasks can be joined
        if (task.getStatus() != TaskStatus.OPEN) {
            throw new UnauthorizedException("You can only sign up for open tasks");
        }

        // prevent duplicate signup
        participantRepository.findByTaskAndUser(task, user).ifPresent(p -> {
            throw new UnauthorizedException("You have already signed up for this task");
        });

        TaskParticipant participant = new TaskParticipant();
        participant.setTask(task);
        participant.setUser(user);
        participant.setStatus(ParticipationStatus.SIGNED_UP);

        return participantMapper.toResponse(participantRepository.save(participant));
    }

    @Override
    public List<ParticipantResponse> getParticipantsByTask(Long taskId) {
        Task task = getTask(taskId);
        return participantRepository.findByTask(task)
                .stream().map(participantMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public void withdraw(Long taskId, Long userId) {
        TaskParticipant participant = participantRepository
                .findByTaskIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not signed up for this task"));
        participantRepository.delete(participant);
    }

    @Override
    public List<ParticipantResponse> getTasksSignedUpByUser(Long userId) {
        User user = getUser(userId);
        return participantRepository.findByUser(user)
                .stream().map(participantMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public ParticipantResponse updateStatus(Long participantId, String status, Long userId) {
        TaskParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant record not found"));

        // only the participant themselves can update their own status
        if (!participant.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own participation status");
        }

        // parse string → enum (your requirement: IDs as string parsed to Long, same
        // idea for enum)
        ParticipationStatus newStatus;
        try {
            newStatus = ParticipationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException(
                    "Invalid status: " + status + ". Valid values: SIGNED_UP, COMPLETED, CANCELLED");
        }

        participant.setStatus(newStatus);
        return participantMapper.toResponse(participantRepository.save(participant));
    }
}
