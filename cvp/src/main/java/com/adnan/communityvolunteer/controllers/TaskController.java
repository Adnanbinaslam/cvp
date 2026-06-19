package com.adnan.communityvolunteer.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.adnan.communityvolunteer.dtos.ApiResponse;
import com.adnan.communityvolunteer.dtos.TaskRequest;
import com.adnan.communityvolunteer.dtos.TaskResponse;
import com.adnan.communityvolunteer.services.TaskService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // helper: extract userId from JWT filter attribute, parse String → Long
    private Long extractUserId(HttpServletRequest request) {
        String userIdStr = (String) request.getAttribute("userId");
        if (userIdStr == null) throw new com.adnan.communityvolunteer.exceptions.UnauthorizedException("Not authenticated");
        return Long.valueOf(userIdStr);
    }

    // CREATE task — any logged-in user
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest taskRequest,
            HttpServletRequest request) {
        Long userId = extractUserId(request);
        TaskResponse task = taskService.createTask(taskRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Task created and pending admin approval", task));
    }

    // GET all open tasks — public
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllOpenTasks() {
        List<TaskResponse> tasks = taskService.getAllOpenTasks();
        return ResponseEntity.ok(new ApiResponse<>(true, "Open tasks fetched", tasks));
    }

    // GET upcoming open tasks — public
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getUpcomingTasks() {
        List<TaskResponse> tasks = taskService.getUpcomingOpenTasks();
        return ResponseEntity.ok(new ApiResponse<>(true, "Upcoming tasks fetched", tasks));
    }

    // GET by id — public
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable String id) {
        // parse String → Long
        Long taskId = Long.valueOf(id);
        TaskResponse task = taskService.getTaskById(taskId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task fetched", task));
    }

    // SEARCH by location — public
    @GetMapping("/search/location")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> searchByLocation(@RequestParam String location) {
        List<TaskResponse> tasks = taskService.searchByLocation(location);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tasks fetched", tasks));
    }

    // SEARCH by title — public
    @GetMapping("/search/title")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> searchByTitle(@RequestParam String title) {
        List<TaskResponse> tasks = taskService.searchByTitle(title);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tasks fetched", tasks));
    }

    // GET my tasks — logged in
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(HttpServletRequest request) {
        Long userId = extractUserId(request);
        List<TaskResponse> tasks = taskService.getMyTasks(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Your tasks fetched", tasks));
    }

    // GET pending tasks — admin only (checked inside service)
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getPendingTasks() {
        List<TaskResponse> tasks = taskService.getPendingTasks();
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending tasks fetched", tasks));
    }

    // APPROVE task — admin only
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<TaskResponse>> approveTask(
            @PathVariable String id,
            HttpServletRequest request) {
        Long taskId = Long.valueOf(id);
        Long adminId = extractUserId(request);
        TaskResponse task = taskService.approveTask(taskId, adminId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task approved", task));
    }

    // REJECT task — admin only
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<TaskResponse>> rejectTask(
            @PathVariable String id,
            HttpServletRequest request) {
        Long taskId = Long.valueOf(id);
        Long adminId = extractUserId(request);
        TaskResponse task = taskService.rejectTask(taskId, adminId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task rejected", task));
    }

    // DELETE task — owner or admin
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable String id,
            HttpServletRequest request) {
        Long taskId = Long.valueOf(id);
        Long userId = extractUserId(request);
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted", null));
    }
}
