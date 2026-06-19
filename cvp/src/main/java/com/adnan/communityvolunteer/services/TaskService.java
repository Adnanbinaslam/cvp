package com.adnan.communityvolunteer.services;

import java.util.List;

import com.adnan.communityvolunteer.dtos.TaskRequest;
import com.adnan.communityvolunteer.dtos.TaskResponse;

public interface TaskService {
    TaskResponse createTask(TaskRequest request, Long userId);
    TaskResponse getTaskById(Long id);
    List<TaskResponse> getAllOpenTasks();
    List<TaskResponse> getUpcomingOpenTasks();
    List<TaskResponse> searchByLocation(String location);
    List<TaskResponse> searchByTitle(String title);
    List<TaskResponse> getMyTasks(Long userId);
    List<TaskResponse> getPendingTasks();         // admin only
    TaskResponse approveTask(Long taskId, Long adminId);  // admin only
    TaskResponse rejectTask(Long taskId, Long adminId);   // admin only
    void deleteTask(Long taskId, Long userId);
}
