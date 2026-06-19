package com.adnan.communityvolunteer.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adnan.communityvolunteer.entities.User;

import java.util.*;

import com.adnan.communityvolunteer.enums.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    long countByRole(Role role);

    List<User> findByRole(Role role);

    boolean existsByEmail(String email);
}
