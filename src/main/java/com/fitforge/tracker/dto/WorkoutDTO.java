package com.fitforge.tracker.dto;

import java.time.LocalDate;

public class WorkoutDTO {
    private Long id;
    private String typeOfWorkout;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDate date;
    private String notes;
    private Long userId;

    public WorkoutDTO() {
    }

    public WorkoutDTO(Long id, String typeOfWorkout, Integer duration, Integer caloriesBurned, LocalDate date,
            String notes,
            Long userId) {
        this.id = id;
        this.typeOfWorkout = typeOfWorkout;
        this.duration = duration;
        this.caloriesBurned = caloriesBurned;
        this.date = date;
        this.notes = notes;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeOfWorkout() {
        return typeOfWorkout;
    }

    public void setTypeOfWorkout(String typeOfWorkout) {
        this.typeOfWorkout = typeOfWorkout;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
