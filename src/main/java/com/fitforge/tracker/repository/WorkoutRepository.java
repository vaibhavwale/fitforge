package com.fitforge.tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitforge.tracker.entity.Workout;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserId(Long userId);
}