package com.fitforge.tracker.service;

import com.fitforge.tracker.dto.WorkoutDTO;
import com.fitforge.tracker.entity.User;
import com.fitforge.tracker.entity.Workout;
import com.fitforge.tracker.exception.BadRequestException;
import com.fitforge.tracker.exception.ResourceNotFoundException;
import com.fitforge.tracker.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserService userService;

    public WorkoutService(WorkoutRepository workoutRepository, UserService userService) {
        this.workoutRepository = workoutRepository;
        this.userService = userService;
    }

    public List<WorkoutDTO> getAllWorkoutsForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        List<Workout> workouts = workoutRepository.findByUserId(currentUser.getId());
        return workouts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public WorkoutDTO getWorkoutById(Long id) {
        User currentUser = userService.getCurrentUser();
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));

        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to access this workout");
        }

        return convertToDTO(workout);
    }

    public WorkoutDTO createWorkout(WorkoutDTO workoutDTO) {
        User currentUser = userService.getCurrentUser();

        Workout workout = new Workout();
        workout.setTypeOfWorkout(workoutDTO.getTypeOfWorkout());
        workout.setDuration(workoutDTO.getDuration());
        workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());
        workout.setDate(workoutDTO.getDate() != null ? workoutDTO.getDate() : LocalDate.now());
        workout.setNotes(workoutDTO.getNotes());
        workout.setUser(currentUser);

        Workout savedWorkout = workoutRepository.save(workout);
        return convertToDTO(savedWorkout);
    }

    public WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO) {
        User currentUser = userService.getCurrentUser();
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));

        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to update this workout");
        }

        if (workoutDTO.getTypeOfWorkout() != null) {
            workout.setTypeOfWorkout(workoutDTO.getTypeOfWorkout());
        }
        if (workoutDTO.getDuration() != null) {
            workout.setDuration(workoutDTO.getDuration());
        }
        if (workoutDTO.getCaloriesBurned() != null) {
            workout.setCaloriesBurned(workoutDTO.getCaloriesBurned());
        }
        if (workoutDTO.getDate() != null) {
            workout.setDate(workoutDTO.getDate());
        }
        if (workoutDTO.getNotes() != null) {
            workout.setNotes(workoutDTO.getNotes());
        }

        Workout updatedWorkout = workoutRepository.save(workout);
        return convertToDTO(updatedWorkout);
    }

    public void deleteWorkout(Long id) {
        User currentUser = userService.getCurrentUser();
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));

        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to delete this workout");
        }

        workoutRepository.delete(workout);
    }

    public List<WorkoutDTO> getWorkoutsByDateRange(LocalDate startDate, LocalDate endDate) {
        User currentUser = userService.getCurrentUser();
        List<Workout> workouts = workoutRepository.findByUserId(currentUser.getId());

        return workouts.stream()
                .filter(w -> !w.getDate().isBefore(startDate) && !w.getDate().isAfter(endDate))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private WorkoutDTO convertToDTO(Workout workout) {
        WorkoutDTO dto = new WorkoutDTO();
        dto.setId(workout.getId());
        dto.setTypeOfWorkout(workout.getTypeOfWorkout());
        dto.setDuration(workout.getDuration());
        dto.setCaloriesBurned(workout.getCaloriesBurned());
        dto.setDate(workout.getDate());
        dto.setNotes(workout.getNotes());
        dto.setUserId(workout.getUser().getId());
        return dto;
    }

    public Long getCurrentUserId() {
        return userService.getCurrentUser().getId();
    }
}
