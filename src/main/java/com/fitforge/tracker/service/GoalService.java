package com.fitforge.tracker.service;

import com.fitforge.tracker.dto.GoalDTO;
import com.fitforge.tracker.entity.Goal;
import com.fitforge.tracker.entity.User;
import com.fitforge.tracker.exception.BadRequestException;
import com.fitforge.tracker.exception.ResourceNotFoundException;
import com.fitforge.tracker.repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserService userService;

    public GoalService(GoalRepository goalRepository, UserService userService) {
        this.goalRepository = goalRepository;
        this.userService = userService;
    }

    /**
     * Get all goals for current user
     */
    public List<GoalDTO> getUserGoals() {
        User currentUser = userService.getCurrentUser();
        List<Goal> goals = goalRepository.findByUserId(currentUser.getId());
        return goals.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get active goals for current user
     */
    public List<GoalDTO> getActiveGoals() {
        User currentUser = userService.getCurrentUser();
        List<Goal> goals = goalRepository.findByUserIdAndStatus(currentUser.getId(), "active");
        return goals.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Get goal by ID
     */
    public GoalDTO getGoalById(Long id) {
        User currentUser = userService.getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        if (!goal.getUserId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to access this goal");
        }

        return convertToDTO(goal);
    }

    /**
     * Create new goal
     */
    public GoalDTO createGoal(GoalDTO goalDTO) {
        User currentUser = userService.getCurrentUser();

        Goal goal = new Goal();
        goal.setUserId(currentUser.getId());
        goal.setGoalType(goalDTO.getGoalType());
        goal.setTargetValue(goalDTO.getTargetValue());
        goal.setCurrentValue(goalDTO.getCurrentValue() != null ? goalDTO.getCurrentValue() : 0.0);
        goal.setUnit(goalDTO.getUnit());
        goal.setStartDate(goalDTO.getStartDate() != null ? goalDTO.getStartDate() : LocalDate.now());
        goal.setTargetDate(goalDTO.getTargetDate());
        goal.setStatus("active");

        Goal savedGoal = goalRepository.save(goal);
        return convertToDTO(savedGoal);
    }

    /**
     * Update goal
     */
    public GoalDTO updateGoal(Long id, GoalDTO goalDTO) {
        User currentUser = userService.getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        if (!goal.getUserId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to update this goal");
        }

        if (goalDTO.getTargetValue() != null) {
            goal.setTargetValue(goalDTO.getTargetValue());
        }
        if (goalDTO.getCurrentValue() != null) {
            goal.setCurrentValue(goalDTO.getCurrentValue());

            // Auto-complete goal if target reached
            if (goal.getCurrentValue() >= goal.getTargetValue()) {
                goal.setStatus("completed");
            }
        }
        if (goalDTO.getTargetDate() != null) {
            goal.setTargetDate(goalDTO.getTargetDate());
        }
        if (goalDTO.getStatus() != null) {
            goal.setStatus(goalDTO.getStatus());
        }

        Goal updatedGoal = goalRepository.save(goal);
        return convertToDTO(updatedGoal);
    }

    /**
     * Delete goal
     */
    public void deleteGoal(Long id) {
        User currentUser = userService.getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        if (!goal.getUserId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to delete this goal");
        }

        goalRepository.delete(goal);
    }

    /**
     * Update goal progress
     */
    public GoalDTO updateProgress(Long id, Double newValue) {
        User currentUser = userService.getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        if (!goal.getUserId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to update this goal");
        }

        goal.setCurrentValue(newValue);

        // Auto-complete goal if target reached
        if (newValue >= goal.getTargetValue()) {
            goal.setStatus("completed");
        }

        Goal updatedGoal = goalRepository.save(goal);
        return convertToDTO(updatedGoal);
    }

    /**
     * Convert Goal entity to DTO
     */
    private GoalDTO convertToDTO(Goal goal) {
        GoalDTO dto = new GoalDTO();
        dto.setId(goal.getId());
        dto.setGoalType(goal.getGoalType());
        dto.setTargetValue(goal.getTargetValue());
        dto.setCurrentValue(goal.getCurrentValue());
        dto.setUnit(goal.getUnit());
        dto.setStartDate(goal.getStartDate());
        dto.setTargetDate(goal.getTargetDate());
        dto.setStatus(goal.getStatus());
        dto.setProgressPercentage(goal.getProgressPercentage());
        return dto;
    }
}
