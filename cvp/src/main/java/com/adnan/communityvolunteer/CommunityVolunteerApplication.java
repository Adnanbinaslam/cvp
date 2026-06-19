package com.adnan.communityvolunteer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync  
public class CommunityVolunteerApplication {
    public static void main(String[] args) {
        SpringApplication.run(CommunityVolunteerApplication.class, args);
    }
}
