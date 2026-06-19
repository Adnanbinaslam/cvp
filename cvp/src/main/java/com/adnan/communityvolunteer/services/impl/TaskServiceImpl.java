package com.adnan.communityvolunteer.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.adnan.communityvolunteer.dtos.TaskRequest;
import com.adnan.communityvolunteer.dtos.TaskResponse;
import com.adnan.communityvolunteer.entities.Task;
import com.adnan.communityvolunteer.entities.User;
import com.adnan.communityvolunteer.enums.Role;
import com.adnan.communityvolunteer.enums.TaskStatus;
import com.adnan.communityvolunteer.exceptions.ResourceNotFoundException;
import com.adnan.communityvolunteer.exceptions.UnauthorizedException;
import com.adnan.communityvolunteer.mappers.TaskMapper;
import com.adnan.communityvolunteer.repositories.TaskRepository;
import com.adnan.communityvolunteer.repositories.UserRepository;
import com.adnan.communityvolunteer.services.NominatimService;
import com.adnan.communityvolunteer.services.TaskService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final NominatimService nominatimService;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private Task getTask(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    @Override
    public TaskResponse createTask(TaskRequest request, Long userId) {
        User user = getUser(userId);
        Task task = taskMapper.toEntity(request, user);

        double[] coords = nominatimService.geocode(request.getLocation());
        task.setLatitude(coords[0]);
        task.setLongitude(coords[1]);

        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        return taskMapper.toResponse(getTask(id));
    }

    @Override
    public List<TaskResponse> getAllOpenTasks() {
        return taskRepository.findByStatus(TaskStatus.OPEN)
                .stream().map(taskMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getUpcomingOpenTasks() {
        return taskRepository.findByStatusAndDateAfter(TaskStatus.OPEN, LocalDateTime.now())
                .stream().map(taskMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> searchByLocation(String location) {
        return taskRepository.findByStatusAndLocationContainingIgnoreCase(TaskStatus.OPEN, location)
                .stream().map(taskMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> searchByTitle(String title) {
        return taskRepository.findByStatusAndTitleContainingIgnoreCase(TaskStatus.OPEN, title)
                .stream().map(taskMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getMyTasks(Long userId) {
        User user = getUser(userId);
        return taskRepository.findByCreatedBy(user)
                .stream().map(taskMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getPendingTasks() {
        return taskRepository.findByStatus(TaskStatus.PENDING)
                .stream().map(taskMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public TaskResponse approveTask(Long taskId, Long adminId) {
        User admin = getUser(adminId);
        if (admin.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can approve tasks");
        }
        Task task = getTask(taskId);
        if (task.getStatus() != TaskStatus.PENDING) {
            throw new UnauthorizedException("Only pending tasks can be approved");
        }
        task.setStatus(TaskStatus.OPEN);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse rejectTask(Long taskId, Long adminId) {
        User admin = getUser(adminId);
        if (admin.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can reject tasks");
        }
        Task task = getTask(taskId);
        if (task.getStatus() != TaskStatus.PENDING) {
            throw new UnauthorizedException("Only pending tasks can be rejected");
        }
        task.setStatus(TaskStatus.REJECTED);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long taskId, Long userId) {
        User user = getUser(userId);
        Task task = getTask(taskId);
        // admin can delete any task, owner can delete their own
        if (user.getRole() != Role.ADMIN && !task.getCreatedBy().getId().equals(userId)) {
            throw new UnauthorizedException("You are not allowed to delete this task");
        }
        taskRepository.deleteById(taskId);
    }
}
