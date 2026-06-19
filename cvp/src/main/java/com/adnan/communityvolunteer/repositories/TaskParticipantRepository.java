package com.adnan.communityvolunteer.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.adnan.communityvolunteer.entities.Task;
import com.adnan.communityvolunteer.entities.TaskParticipant;
import com.adnan.communityvolunteer.entities.User;
import com.adnan.communityvolunteer.enums.ParticipationStatus;

@Repository
public interface TaskParticipantRepository extends JpaRepository<TaskParticipant, Long> {

    @Query("SELECT tp FROM TaskParticipant tp LEFT JOIN FETCH tp.task LEFT JOIN FETCH tp.user WHERE tp.task = :task")
    List<TaskParticipant> findByTask(@Param("task") Task task);

    @Query("SELECT tp FROM TaskParticipant tp LEFT JOIN FETCH tp.task t LEFT JOIN FETCH t.createdBy LEFT JOIN FETCH tp.user WHERE tp.user = :user")
    List<TaskParticipant> findByUser(@Param("user") User user);

    Optional<TaskParticipant> findByTaskAndUser(Task task, User user);

    long countByStatus(ParticipationStatus status);

    Optional<TaskParticipant> findByTaskIdAndUserId(Long taskId, Long userId);

    @Query("SELECT SUM(t.duration) FROM TaskParticipant tp JOIN tp.task t WHERE tp.status = 'COMPLETED'")
    Long sumCompletedTaskDurations();
}