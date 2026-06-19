package com.adnan.communityvolunteer.repositories;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.adnan.communityvolunteer.entities.Task;
import com.adnan.communityvolunteer.entities.User;
import com.adnan.communityvolunteer.enums.TaskStatus;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.createdBy LEFT JOIN FETCH t.participants WHERE t.status = :status")
    List<Task> findByStatus(@Param("status") TaskStatus status);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.createdBy LEFT JOIN FETCH t.participants WHERE t.createdBy = :user")
    List<Task> findByCreatedBy(@Param("user") User user);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.createdBy LEFT JOIN FETCH t.participants WHERE t.status = :status AND t.date > :date")
    List<Task> findByStatusAndDateAfter(@Param("status") TaskStatus status, @Param("date") LocalDateTime date);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.createdBy LEFT JOIN FETCH t.participants WHERE t.status = :status AND LOWER(t.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Task> findByStatusAndLocationContainingIgnoreCase(@Param("status") TaskStatus status,
            @Param("location") String location);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.createdBy LEFT JOIN FETCH t.participants WHERE t.status = :status AND LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Task> findByStatusAndTitleContainingIgnoreCase(@Param("status") TaskStatus status,
            @Param("title") String title);

    long countByStatus(TaskStatus status);
}