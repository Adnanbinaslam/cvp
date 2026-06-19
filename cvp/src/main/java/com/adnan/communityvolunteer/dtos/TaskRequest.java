package com.adnan.communityvolunteer.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    
    @NotNull(message = "Max volunteers is required")
    @Positive(message = "Max volunteers must be positive")
    private int maxVolunteers;

    @NotNull(message = "Date is required")
    @Future(message = "Date must be in the future")
    private LocalDateTime date;

    @Positive(message = "Duration must be positive")
    private int duration;
}
