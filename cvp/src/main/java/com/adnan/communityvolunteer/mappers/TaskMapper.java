    package com.adnan.communityvolunteer.mappers;

    import org.springframework.stereotype.Component;
    import com.adnan.communityvolunteer.dtos.TaskRequest;
    import com.adnan.communityvolunteer.dtos.TaskResponse;
    import com.adnan.communityvolunteer.entities.Task;
    import com.adnan.communityvolunteer.entities.User;
    import com.adnan.communityvolunteer.enums.TaskStatus;

    import lombok.RequiredArgsConstructor;

    @Component
    @RequiredArgsConstructor
    public class TaskMapper {

        private final UserMapper userMapper;

        public Task toEntity(TaskRequest request, User createdBy) {
            Task task = new Task();
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setLocation(request.getLocation());
            task.setMaxVolunteers(request.getMaxVolunteers());
            task.setDate(request.getDate());
            task.setDuration(request.getDuration());
            task.setStatus(TaskStatus.PENDING);
            task.setCreatedBy(createdBy);
            return task;
        }

        public TaskResponse toResponse(Task task) {
            TaskResponse response = new TaskResponse();
            response.setId(task.getId());
            response.setTitle(task.getTitle());
            response.setDescription(task.getDescription());
            response.setLocation(task.getLocation());
            response.setLatitude(task.getLatitude());
            response.setLongitude(task.getLongitude());
            response.setDate(task.getDate());
            response.setDuration(task.getDuration());
             response.setMaxVolunteers(task.getMaxVolunteers()); 
            response.setStatus(task.getStatus());
            response.setCreatedAt(task.getCreatedAt());
            response.setCreatedBy(userMapper.toResponse(task.getCreatedBy()));
            response.setParticipantCount(
                task.getParticipants() != null ? task.getParticipants().size() : 0
            );
            return response;
        }
    }
