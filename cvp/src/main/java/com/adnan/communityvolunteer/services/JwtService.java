package com.adnan.communityvolunteer.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(Long userId) {
        return JWT.create()
                .withSubject(String.valueOf(userId))
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpiration))
                .sign(Algorithm.HMAC256(jwtSecret));
    }

    // returns String because userId stored as string in JWT subject
    public String extractUserId(String token) {
        DecodedJWT decoded = JWT.require(Algorithm.HMAC256(jwtSecret))
                .build()
                .verify(token);
        return decoded.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            JWT.require(Algorithm.HMAC256(jwtSecret)).build().verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
