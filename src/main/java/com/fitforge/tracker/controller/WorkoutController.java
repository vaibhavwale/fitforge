package com.fitforge.tracker.controller;

import com.fitforge.tracker.dto.WorkoutDTO;
import com.fitforge.tracker.dto.WorkoutStatisticsDTO;
import com.fitforge.tracker.service.WorkoutService;
import com.fitforge.tracker.service.WorkoutStatisticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final WorkoutStatisticsService statisticsService;

    public WorkoutController(WorkoutService workoutService, WorkoutStatisticsService statisticsService) {
        this.workoutService = workoutService;
        this.statisticsService = statisticsService;
    }

    @GetMapping
    public ResponseEntity<List<WorkoutDTO>> getAllWorkouts() {
        return ResponseEntity.ok(workoutService.getAllWorkoutsForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDTO> getWorkoutById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutService.getWorkoutById(id));
    }

    @PostMapping
    public ResponseEntity<WorkoutDTO> createWorkout(@RequestBody WorkoutDTO workoutDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workoutService.createWorkout(workoutDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutDTO> updateWorkout(@PathVariable Long id,
            @RequestBody WorkoutDTO workoutDTO) {
        return ResponseEntity.ok(workoutService.updateWorkout(id, workoutDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok(Map.of("message", "Workout deleted successfully"));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<WorkoutDTO>> getWorkoutsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(workoutService.getWorkoutsByDateRange(startDate, endDate));
    }

    // Statistics endpoints
    @GetMapping("/statistics/weekly")
    public ResponseEntity<WorkoutStatisticsDTO> getWeeklyStatistics() {
        Long userId = workoutService.getCurrentUserId();
        return ResponseEntity.ok(statisticsService.getWeeklyStats(userId));
    }

    @GetMapping("/statistics/monthly")
    public ResponseEntity<WorkoutStatisticsDTO> getMonthlyStatistics() {
        Long userId = workoutService.getCurrentUserId();
        return ResponseEntity.ok(statisticsService.getMonthlyStats(userId));
    }

    @GetMapping("/statistics/yearly")
    public ResponseEntity<WorkoutStatisticsDTO> getYearlyStatistics() {
        Long userId = workoutService.getCurrentUserId();
        return ResponseEntity.ok(statisticsService.getYearlyStats(userId));
    }

    @GetMapping("/statistics")
    public ResponseEntity<WorkoutStatisticsDTO> getStatistics(
            @RequestParam(defaultValue = "30") int days) {
        Long userId = workoutService.getCurrentUserId();
        return ResponseEntity.ok(statisticsService.getStatistics(userId, days));
    }
}