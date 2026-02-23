package com.fitforge.tracker.dto;

import java.util.List;
import java.util.Map;

public class WorkoutStatisticsDTO {
    private Integer totalWorkouts;
    private Integer totalCalories;
    private Integer totalDuration;
    private Integer currentStreak;
    private Integer longestStreak;
    private Double averageCaloriesPerWorkout;
    private Double averageDurationPerWorkout;
    private Map<String, Integer> workoutTypeDistribution;
    private List<DailyStatsDTO> dailyStats;
    private Map<String, Object> personalRecords;

    public WorkoutStatisticsDTO() {
    }

    // Getters and Setters
    public Integer getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(Integer totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    public Integer getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(Integer totalCalories) {
        this.totalCalories = totalCalories;
    }

    public Integer getTotalDuration() {
        return totalDuration;
    }

    public void setTotalDuration(Integer totalDuration) {
        this.totalDuration = totalDuration;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public Double getAverageCaloriesPerWorkout() {
        return averageCaloriesPerWorkout;
    }

    public void setAverageCaloriesPerWorkout(Double averageCaloriesPerWorkout) {
        this.averageCaloriesPerWorkout = averageCaloriesPerWorkout;
    }

    public Double getAverageDurationPerWorkout() {
        return averageDurationPerWorkout;
    }

    public void setAverageDurationPerWorkout(Double averageDurationPerWorkout) {
        this.averageDurationPerWorkout = averageDurationPerWorkout;
    }

    public Map<String, Integer> getWorkoutTypeDistribution() {
        return workoutTypeDistribution;
    }

    public void setWorkoutTypeDistribution(Map<String, Integer> workoutTypeDistribution) {
        this.workoutTypeDistribution = workoutTypeDistribution;
    }

    public List<DailyStatsDTO> getDailyStats() {
        return dailyStats;
    }

    public void setDailyStats(List<DailyStatsDTO> dailyStats) {
        this.dailyStats = dailyStats;
    }

    public Map<String, Object> getPersonalRecords() {
        return personalRecords;
    }

    public void setPersonalRecords(Map<String, Object> personalRecords) {
        this.personalRecords = personalRecords;
    }

    // Inner class for daily statistics
    public static class DailyStatsDTO {
        private String date;
        private Integer workouts;
        private Integer calories;
        private Integer duration;

        public DailyStatsDTO() {
        }

        public DailyStatsDTO(String date, Integer workouts, Integer calories, Integer duration) {
            this.date = date;
            this.workouts = workouts;
            this.calories = calories;
            this.duration = duration;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Integer getWorkouts() {
            return workouts;
        }

        public void setWorkouts(Integer workouts) {
            this.workouts = workouts;
        }

        public Integer getCalories() {
            return calories;
        }

        public void setCalories(Integer calories) {
            this.calories = calories;
        }

        public Integer getDuration() {
            return duration;
        }

        public void setDuration(Integer duration) {
            this.duration = duration;
        }
    }
}
