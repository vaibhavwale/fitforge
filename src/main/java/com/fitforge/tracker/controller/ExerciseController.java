package com.fitforge.tracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fitforge.tracker.model.Exercise;
import com.fitforge.tracker.service.ExerciseService;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService service;

    public ExerciseController(ExerciseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Exercise> getAll() {
        return service.getAllExercises();
    }

    @GetMapping("/{name}")
    public Exercise getByName(@PathVariable String name) {
        return service.getExerciseByName(name);
    }

    @GetMapping("/search")
    public List<Exercise> search(@RequestParam String name) {
        return service.searchExercises(name);
    }
}