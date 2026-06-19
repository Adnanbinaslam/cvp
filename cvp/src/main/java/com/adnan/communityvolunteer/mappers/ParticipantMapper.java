package com.adnan.communityvolunteer.mappers;

import org.springframework.stereotype.Component;

import com.adnan.communityvolunteer.dtos.ParticipantResponse;
import com.adnan.communityvolunteer.entities.TaskParticipant;

@Component
public class ParticipantMapper {

    public ParticipantResponse toResponse(TaskParticipant participant) {
        ParticipantResponse response = new ParticipantResponse();
        response.setId(participant.getId());
        response.setStatus(participant.getStatus());

        if (participant.getTask() != null) {
            response.setTaskId(participant.getTask().getId());
            response.setTaskTitle(participant.getTask().getTitle());
            response.setTaskDate(participant.getTask().getDate().toString());
            response.setTaskLocation(participant.getTask().getLocation());
        }

        if (participant.getUser() != null) {
            response.setUserId(participant.getUser().getId());
            response.setUserName(participant.getUser().getName());
            response.setUserEmail(participant.getUser().getEmail());
        }

        return response;
    }
}
