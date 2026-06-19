package com.adnan.communityvolunteer.dtos;

import java.time.LocalDateTime;

import com.adnan.communityvolunteer.enums.TaskStatus;

import lombok.Data;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    private LocalDateTime date;
    private int duration;
    private int maxVolunteers;
    private TaskStatus status;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
    private int participantCount;
}
