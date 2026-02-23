package com.fitforge.tracker.service;

import com.fitforge.tracker.model.Exercise;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;

import java.util.List;
import java.util.ArrayList;

@Service
public class ExerciseService {

    private final String API_URL = "https://exercisedb.p.rapidapi.com/exercises?limit=1000";
    private final String API_KEY = "49b6731f5dmsh85cb8473d1dc7dbp1f5150jsn99b90f771e76";
    private final String API_HOST = "exercisedb.p.rapidapi.com";

    private List<Exercise> exercises = new ArrayList<>();

    public ExerciseService() {
        refreshExercises();
    }

    public void refreshExercises() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", API_KEY);
            headers.set("X-RapidAPI-Host", API_HOST);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List<Exercise>> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Exercise>>() {
                    });

            if (response.getBody() != null) {
                this.exercises = response.getBody();
                System.out.println("Loaded " + exercises.size() + " exercises from API.");
            }
        } catch (Exception e) {
            System.err.println("Failed to load exercises from API: " + e.getMessage());
        }
    }

    public List<Exercise> getAllExercises() {
        return exercises;
    }

    public Exercise getExerciseByName(String name) {
        return exercises.stream()
                .filter(e -> e.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }

    public List<Exercise> searchExercises(String name) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", API_KEY);
            headers.set("X-RapidAPI-Host", API_HOST);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            String searchUrl = "https://exercisedb.p.rapidapi.com/exercises/name/" + name;

            ResponseEntity<List<Exercise>> response = restTemplate.exchange(
                    searchUrl,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Exercise>>() {
                    });

            if (response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Failed to search exercises: " + e.getMessage());
        }
        return new ArrayList<>();
    }
}