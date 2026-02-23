package com.fitforge.tracker.service;

import com.fitforge.tracker.dto.WorkoutStatisticsDTO;
import com.fitforge.tracker.dto.WorkoutStatisticsDTO.DailyStatsDTO;
import com.fitforge.tracker.entity.Workout;
import com.fitforge.tracker.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkoutStatisticsService {

    private final WorkoutRepository workoutRepository;

    public WorkoutStatisticsService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    /**
     * Get comprehensive workout statistics for a user
     */
    public WorkoutStatisticsDTO getStatistics(Long userId, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        List<Workout> workouts = workoutRepository.findByUserId(userId);
        List<Workout> periodWorkouts = workouts.stream()
                .filter(w -> !w.getDate().isBefore(startDate) && !w.getDate().isAfter(endDate))
                .collect(Collectors.toList());

        WorkoutStatisticsDTO stats = new WorkoutStatisticsDTO();

        // Basic statistics
        stats.setTotalWorkouts(periodWorkouts.size());
        stats.setTotalCalories(periodWorkouts.stream()
                .mapToInt(w -> w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 0)
                .sum());
        stats.setTotalDuration(periodWorkouts.stream()
                .mapToInt(w -> w.getDuration() != null ? w.getDuration() : 0)
                .sum());

        // Averages
        if (!periodWorkouts.isEmpty()) {
            stats.setAverageCaloriesPerWorkout((double) stats.getTotalCalories() / periodWorkouts.size());
            stats.setAverageDurationPerWorkout((double) stats.getTotalDuration() / periodWorkouts.size());
        } else {
            stats.setAverageCaloriesPerWorkout(0.0);
            stats.setAverageDurationPerWorkout(0.0);
        }

        // Workout type distribution
        Map<String, Integer> distribution = periodWorkouts.stream()
                .collect(Collectors.groupingBy(
                        Workout::getTypeOfWorkout,
                        Collectors.summingInt(w -> 1)));
        stats.setWorkoutTypeDistribution(distribution);

        // Daily statistics
        stats.setDailyStats(calculateDailyStats(periodWorkouts, startDate, endDate));

        // Streaks
        Map<String, Integer> streaks = calculateStreaks(workouts);
        stats.setCurrentStreak(streaks.get("current"));
        stats.setLongestStreak(streaks.get("longest"));

        // Personal records
        stats.setPersonalRecords(calculatePersonalRecords(workouts));

        return stats;
    }

    /**
     * Calculate daily statistics for the period
     */
    private List<DailyStatsDTO> calculateDailyStats(List<Workout> workouts, LocalDate startDate, LocalDate endDate) {
        Map<LocalDate, List<Workout>> workoutsByDate = workouts.stream()
                .collect(Collectors.groupingBy(Workout::getDate));

        List<DailyStatsDTO> dailyStats = new ArrayList<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            List<Workout> dayWorkouts = workoutsByDate.getOrDefault(currentDate, Collections.emptyList());

            int totalCalories = dayWorkouts.stream()
                    .mapToInt(w -> w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 0)
                    .sum();
            int totalDuration = dayWorkouts.stream()
                    .mapToInt(w -> w.getDuration() != null ? w.getDuration() : 0)
                    .sum();

            dailyStats.add(new DailyStatsDTO(
                    currentDate.toString(),
                    dayWorkouts.size(),
                    totalCalories,
                    totalDuration));

            currentDate = currentDate.plusDays(1);
        }

        return dailyStats;
    }

    /**
     * Calculate current and longest workout streaks
     */
    private Map<String, Integer> calculateStreaks(List<Workout> workouts) {
        if (workouts.isEmpty()) {
            return Map.of("current", 0, "longest", 0);
        }

        // Get unique workout dates sorted
        List<LocalDate> workoutDates = workouts.stream()
                .map(Workout::getDate)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        int currentStreak = 0;
        int longestStreak = 0;
        int tempStreak = 1;

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // Calculate current streak
        if (!workoutDates.isEmpty()) {
            LocalDate lastWorkoutDate = workoutDates.get(workoutDates.size() - 1);

            if (lastWorkoutDate.equals(today) || lastWorkoutDate.equals(yesterday)) {
                currentStreak = 1;

                for (int i = workoutDates.size() - 2; i >= 0; i--) {
                    LocalDate prevDate = workoutDates.get(i);
                    LocalDate nextDate = workoutDates.get(i + 1);

                    if (ChronoUnit.DAYS.between(prevDate, nextDate) == 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }

        // Calculate longest streak
        for (int i = 1; i < workoutDates.size(); i++) {
            LocalDate prevDate = workoutDates.get(i - 1);
            LocalDate currentDate = workoutDates.get(i);

            if (ChronoUnit.DAYS.between(prevDate, currentDate) == 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return Map.of("current", currentStreak, "longest", longestStreak);
    }

    /**
     * Calculate personal records
     */
    private Map<String, Object> calculatePersonalRecords(List<Workout> workouts) {
        Map<String, Object> records = new HashMap<>();

        if (workouts.isEmpty()) {
            return records;
        }

        // Most calories in a single workout
        Workout maxCaloriesWorkout = workouts.stream()
                .max(Comparator.comparing(w -> w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 0))
                .orElse(null);

        if (maxCaloriesWorkout != null) {
            records.put("maxCalories", Map.of(
                    "value", maxCaloriesWorkout.getCaloriesBurned(),
                    "type", maxCaloriesWorkout.getTypeOfWorkout(),
                    "date", maxCaloriesWorkout.getDate().toString()));
        }

        // Longest workout duration
        Workout maxDurationWorkout = workouts.stream()
                .max(Comparator.comparing(w -> w.getDuration() != null ? w.getDuration() : 0))
                .orElse(null);

        if (maxDurationWorkout != null) {
            records.put("maxDuration", Map.of(
                    "value", maxDurationWorkout.getDuration(),
                    "type", maxDurationWorkout.getTypeOfWorkout(),
                    "date", maxDurationWorkout.getDate().toString()));
        }

        // Most workouts in a week
        Map<String, Long> weeklyWorkouts = workouts.stream()
                .collect(Collectors.groupingBy(
                        w -> w.getDate().minusDays(w.getDate().getDayOfWeek().getValue() - 1).toString(),
                        Collectors.counting()));

        if (!weeklyWorkouts.isEmpty()) {
            Map.Entry<String, Long> maxWeek = weeklyWorkouts.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .orElse(null);

            if (maxWeek != null) {
                records.put("maxWeeklyWorkouts", Map.of(
                        "value", maxWeek.getValue(),
                        "week", maxWeek.getKey()));
            }
        }

        return records;
    }

    /**
     * Get weekly summary statistics
     */
    public WorkoutStatisticsDTO getWeeklyStats(Long userId) {
        return getStatistics(userId, 7);
    }

    /**
     * Get monthly summary statistics
     */
    public WorkoutStatisticsDTO getMonthlyStats(Long userId) {
        return getStatistics(userId, 30);
    }

    /**
     * Get yearly summary statistics
     */
    public WorkoutStatisticsDTO getYearlyStats(Long userId) {
        return getStatistics(userId, 365);
    }
}
