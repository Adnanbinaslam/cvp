package com.adnan.communityvolunteer.dtos;

import com.adnan.communityvolunteer.enums.ParticipationStatus;

import lombok.Data;

@Data
public class ParticipantResponse {
    private Long id;
    private Long taskId;
    private String taskTitle;
    private String taskDate;      // ✅ add
    private String taskLocation;  // ✅ add
    private Long userId;
    private String userName;
    private String userEmail;
    private ParticipationStatus status;
}
