package com.adnan.communityvolunteer.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NominatimService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public double[] geocode(String location) {
        try {
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + location.replace(" ", "+")
                    + "&format=json&limit=1";

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            if (root.isArray() && root.size() > 0) {
                double lat = root.get(0).get("lat").asDouble();
                double lon = root.get(0).get("lon").asDouble();
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            log.warn("Geocoding failed for location: {}", location);
        }

        // return nulls if geocoding fails — task still saves
        return new double[]{0.0, 0.0};
    }
}