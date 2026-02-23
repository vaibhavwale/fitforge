package com.fitforge.tracker.controller;

import com.fitforge.tracker.dto.GoalDTO;
import com.fitforge.tracker.service.GoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<GoalDTO>> getAllGoals() {
        return ResponseEntity.ok(goalService.getUserGoals());
    }

    @GetMapping("/active")
    public ResponseEntity<List<GoalDTO>> getActiveGoals() {
        return ResponseEntity.ok(goalService.getActiveGoals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalDTO> getGoalById(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.getGoalById(id));
    }

    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(@RequestBody GoalDTO goalDTO) {
        return ResponseEntity.ok(goalService.createGoal(goalDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable Long id, @RequestBody GoalDTO goalDTO) {
        return ResponseEntity.ok(goalService.updateGoal(id, goalDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/progress")
    public ResponseEntity<GoalDTO> updateProgress(@PathVariable Long id, @RequestBody Map<String, Double> request) {
        Double newValue = request.get("value");
        return ResponseEntity.ok(goalService.updateProgress(id, newValue));
    }
}
