package com.adnan.communityvolunteer.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    @Async
    public void sendSignupConfirmation(String toEmail, String taskTitle) {
         System.out.println("Email sending started in background thread");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Volunteer Signup Confirmed!");
        message.setText("Hi! You have successfully signed up for: "
                + taskTitle
                + "\n\nThank you for contributing to the community!");
        mailSender.send(message);

        System.out.println("After email call - should print immediately");
    }
}